import logging
import json

from osu import Client, GameModeStr, RankingType, UserScoreType
from tqdm import tqdm

from config.api_config import OsuAPIConfig
from config.database_config import database

logger = logging.getLogger(__name__)


class OsuAPIService:
    def __init__(self):
        self.client = Client.from_credentials(OsuAPIConfig.OSU_CLIENT_ID, OsuAPIConfig.OSU_CLIENT_SECRET,
                                              OsuAPIConfig.redirect_url)
        self.player_collection = database.get_player_collection()
        self.scores_collection = database.get_scores_collection()
        self.recent_score_cache = database.get_recent_scores_cache()
        self.player_stats_collection = database.get_player_stats_collection()
        self.redis_client = database.redis

    def get_scores(self):
        cached = self.redis_client.get('scores')
        if cached:
            return json.loads(cached)

        scores = list(self.scores_collection.find().sort("pp", -1).limit(200))
        database.sync_redis_cache_field(scores, "scores")
        return scores

    def get_recent_scores(self):
        return list(self.recent_score_cache.find().sort("ended_at", 1))

    def get_players(self):
        cached = self.redis_client.get('players')
        if cached:
            return json.loads(cached)

        players = list(self.player_collection.find({}).sort("performance_points", -1))
        database.sync_redis_cache_field(players, "players")
        return players

    def sync_redis_cache_all(self):
        players = list(self.player_collection.find({}).sort("performance_points", -1))
        database.sync_redis_cache_field(players, "players")
        scores = list(self.scores_collection.find().sort("pp", -1).limit(200))
        database.sync_redis_cache_field(scores, "scores")

    def sync_all_scores(self):
        player_ids = self.player_collection.distinct("_id")

        for player_id in tqdm(player_ids, desc="Overall Player Score Update", unit="player"):
            self.sync_player_scores(player_id)

    def sync_scores_limited(self, amount):
        player_ids = self.player_collection.distinct("_id")

        for player_id in tqdm(player_ids[:int(amount)], desc="Limited Player Score Update", unit="player"):
            self.sync_player_scores(player_id)

    def sync_player_scores(self, player_id):
        player_top_scores = self.client.get_user_scores(player_id, UserScoreType.BEST, mode=GameModeStr.STANDARD,
                                                        limit=200)

        for score in player_top_scores:
            mods = score.mods
            mod_string = ''.join([mod.mod.value for mod in mods]) or 'NM'
            if "DT" in mod_string or "NC" in mod_string:
                bpm_scaler = 1.5
            elif "HT" in mod_string:
                bpm_scaler = 0.75
            else:
                bpm_scaler = 1.0

            score_data = {
                "_id": str(score.id),
                "user_id": str(score.user_id),

                "beatmap_id": score.beatmapset.id,
                "background_url": f"https://assets.ppy.sh/beatmaps/{score.beatmapset.id}/covers/cover.jpg",
                "artist": score.beatmapset.artist,
                "title": score.beatmapset.title,
                "creator": score.beatmapset.creator,
                "difficulty": score.beatmap.version,
                "last_updated": score.beatmap.last_updated,
                "bpm": score.beatmap.bpm * bpm_scaler,

                "max_combo": score.max_combo,
                "accuracy": score.accuracy,
                "mods": mod_string,
                "rank": score.rank.value,
                "pp": score.pp,
                "ended_at": score.ended_at
            }

            self.scores_collection.update_one({"_id": str(score.id)}, {"$set": score_data}, upsert=True)

    def sync_player(self, player_id):
        data = self.client.get_user(player_id, GameModeStr.STANDARD)
        user = {
            "_id": str(data.id),
            "name": data.username,
            "avatar": data.avatar_url,
            "global_rank": data.statistics.global_rank,
            "performance_points": data.statistics.pp,
        }
        self.player_collection.update_one({"_id": str(data.id)}, {"$set": user}, upsert=True)

    def sync_players(self):
        active_ids = []
        new_ids = []

        existing_ids = set(self.player_collection.distinct("_id"))

        for page_idx in tqdm(range(10), desc="Fetching Leaderboard Pages"):
            rankings = self.client.get_ranking(GameModeStr.STANDARD, RankingType.PERFORMANCE, country="GR",
                                               cursor=None if page_idx == 0 else cursor)
            cursor = rankings.cursor

            for stats in tqdm(rankings.ranking, desc=f"Processing Page {page_idx}", unit="player", leave=False):
                user_id = str(stats.user.id)
                active_ids.append(user_id)

                if user_id not in existing_ids:
                    new_ids.append(user_id)

                user = {
                    "_id": user_id,
                    "name": stats.user.username,
                    "avatar": stats.user.avatar_url,
                    "global_rank": stats.global_rank,
                    "performance_points": stats.pp,
                }
                self.player_collection.update_one({"_id": user_id}, {"$set": user}, upsert=True)

        for player_id in tqdm(new_ids, desc="Fetching scores for new players"):
            self.sync_player_scores(player_id)

        removed = list(self.player_collection.find({"_id": {"$nin": active_ids}}, {"_id": 1}))
        removed_ids = [p["_id"] for p in removed]

        if removed_ids:
            self.player_collection.delete_many({"_id": {"$in": removed_ids}})
            self.scores_collection.delete_many({"user_id": {"$in": removed_ids}})
            self.player_stats_collection.delete_many({"user_id": {"$in": removed_ids}})
            logger.info(f"Trimmed {len(removed_ids)} players and their data")

        logger.info(f"Fetched scores for {len(new_ids)} new players")
