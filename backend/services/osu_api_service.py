import logging

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
        self.recent_score_cache = database.get_recent_scores_collection()
        self.player_stats_collection = database.get_player_stats_collection()

    def get_top_scores(self):
        return list(self.scores_collection.find().sort("pp", -1).limit(200))

    def get_recent_scores(self):
        return list(self.recent_score_cache.find().sort("ended_at", 1))

    def update_all_top_scores(self):
        player_ids = self.player_collection.distinct("_id")

        for player_id in tqdm(player_ids, desc="Overall Player Score Update", unit="player"):
            self.update_player_top_scores(player_id)

    def update_x_top_scores(self, amount):
        player_ids = self.player_collection.distinct("_id")

        for player_id in tqdm(player_ids[:int(amount)], desc="Limited Player Score Update", unit="player"):
            self.update_player_top_scores(player_id)

    def update_player_top_scores(self, player_id):
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

    def get_all_player_info(self):
        return list(self.player_collection.find({}).sort({"performance_points": -1}))

    def update_player_info(self, player_id):
        data = self.client.get_user(player_id, GameModeStr.STANDARD)
        user = {
            "_id": str(data.id),
            "name": data.username,
            "avatar": data.avatar_url,
            "global_rank": data.statistics.global_rank,
            "performance_points": data.statistics.pp,
        }
        self.player_collection.update_one({"_id": str(data.id)}, {"$set": user}, upsert=True)

    def update_player_info_by_page(self):
        active_ids = []

        for page_idx in tqdm(range(10), desc="Fetching Leaderboard Pages"):
            rankings = self.client.get_ranking(GameModeStr.STANDARD, RankingType.PERFORMANCE, country="GR",
                                               cursor=None if page_idx == 0 else cursor)
            cursor = rankings.cursor

            for stats in tqdm(rankings.ranking, desc=f"Processing Page {page_idx}", unit="player", leave=False):
                user_id = str(stats.user.id)
                active_ids.append(user_id)
                user = {
                    "_id": user_id,
                    "name": stats.user.username,
                    "avatar": stats.user.avatar_url,
                    "global_rank": stats.global_rank,
                    "performance_points": stats.pp,
                }
                self.player_collection.update_one({"_id": user_id}, {"$set": user}, upsert=True)

        removed = list(self.player_collection.find(
            {"_id": {"$nin": active_ids}}, {"_id": 1}
        ))
        removed_ids = [p["_id"] for p in removed]

        if removed_ids:
            self.player_collection.delete_many({"_id": {"$in": removed_ids}})
            self.scores_collection.delete_many({"user_id": {"$in": removed_ids}})
            self.recent_score_cache.delete_many({"user_id": {"$in": removed_ids}})
            self.player_stats_collection.delete_many({"user_id": {"$in": removed_ids}})
            logger.info(f"Trimmed {len(removed_ids)} players and their data")
