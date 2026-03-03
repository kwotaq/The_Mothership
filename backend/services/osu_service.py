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

    def get_score_page(self, page, limit):
        page = int(page)
        limit = int(limit)

        skip_amount = (page - 1) * limit

        cursor = self.scores_collection.find() \
            .sort("pp", -1) \
            .skip(skip_amount) \
            .limit(limit)

        scores = list(cursor)

        total_count = self.scores_collection.count_documents({})
        total_pages = (total_count + limit - 1) // limit

        return {
            "scores": scores,
            "total_pages": total_pages,
        }

    def update_all_top_scores(self):
        player_ids = self.player_collection.distinct("_id")

        for player_id in tqdm(player_ids, desc="Overall Player Score Update", unit="player"):
            self.update_player_top_scores(player_id)

    def update_player_top_scores(self, player_id):
        player_top_scores = self.client.get_user_scores(player_id, UserScoreType.BEST, mode=GameModeStr.STANDARD, limit=200)

        for score in player_top_scores:
            mods = score.mods
            mod_string = ''.join([mod.mod.value for mod in mods]) or 'NM'

            score_data = {
                "_id": str(score.id),
                "user_id": str(score.user_id),
                "background_url": f"https://assets.ppy.sh/beatmaps/{score.beatmapset.id}/covers/cover.jpg",
                "artist": score.beatmapset.artist,
                "title": score.beatmapset.title,
                "creator": score.beatmapset.creator,
                "difficulty": score.beatmap.version,
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

    def update_all_player_info(self):
        for page_idx in tqdm(range(2), desc="Fetching Leaderboard Pages"):
            rankings = self.client.get_ranking(GameModeStr.STANDARD, RankingType.PERFORMANCE, country="GR",
                                               cursor=None if page_idx == 0 else cursor)
            cursor = rankings.cursor

            for stats in tqdm(rankings.ranking, desc=f"Processing Page {page_idx}", unit="player", leave=False):
                user = {
                    "_id": str(stats.user.id),
                    "name": stats.user.username,
                    "avatar": stats.user.avatar_url,
                    "global_rank": stats.global_rank,
                    "country_rank": stats.country_rank,
                    "performance_points": stats.pp,
                }
                self.player_collection.update_one({"_id": str(stats.user.id)}, {"$set": user}, upsert=True)