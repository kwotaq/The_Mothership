import logging

from osu import Client, GameModeStr, RankingType, UserScoreType

from config.database_config import database
from config.api_config import OsuAPIConfig

logger = logging.getLogger(__name__)


class OsuAPIService:
    def __init__(self):
        self.client = Client.from_credentials(OsuAPIConfig.OSU_CLIENT_ID, OsuAPIConfig.OSU_CLIENT_SECRET,
                                              OsuAPIConfig.redirect_url)
        self.player_collection = database.get_player_collection()
        self.scores_collection = database.get_scores_collection()

    def get_top_scores(self):
        return list(self.player_collection.find())

    def update_top_scores(self):
        player_ids = self.player_collection.distinct("_id")

        for idx, player_id in enumerate(player_ids):
            player_top_scores = self.client.get_user_scores(player_id, UserScoreType.BEST, limit=100)

            logger.info(f"Updating top scores for player {idx}/{len(player_ids)}")
            for score in player_top_scores:

                mods = score.mods
                mod_string = ''
                for mod in mods:
                    mod_string += mod.mod.value

                score_data = {
                    "_id": score.id,
                    "user_id": score.user_id,
                    "background_url": score.beatmapset.background_url,
                    "artist": score.beatmapset.artist,
                    "title": score.beatmapset.title,
                    "creator": score.beatmapset.creator,
                    "max_combo": score.max_combo,
                    "accuracy": score.accuracy,
                    "mods": mod_string,
                    "rank": score.rank.value,
                    "pp": score.pp,
                    "ended_at": score.ended_at
                }

                self.scores_collection.update_one({"_id": score.id}, {"$set": score_data}, upsert=True)

        logger.info("Updated all top scores")

    def get_player_info(self):
        return list(self.scores_collection.find())

    def update_player_info_list(self):
        logger.info('Fetching player info from osu!api')
        cursor = None
        for page_idx in range(2):
            logger.info(f"Fetching player info from page {page_idx}")
            rankings = self.client.get_ranking(GameModeStr.STANDARD, RankingType.PERFORMANCE, country="GR",
                                               cursor=cursor)
            cursor = rankings.cursor

            for stats in rankings.ranking:
                user = {
                    "_id": stats.user.id,
                    "name": stats.user.username,
                    "avatar": stats.user.avatar_url,
                    "global_rank": stats.global_rank,
                    "country_rank": stats.country_rank,
                    "performance_points": stats.pp,
                }
                self.player_collection.update_one({"_id": stats.user.id}, {"$set": user}, upsert=True)

        logger.info('Updated players')
