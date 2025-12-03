import logging

from osu import Client, GameModeStr, RankingType, UserScoreType

from db.database import database
from osu_api.api_config import OsuAPIConfig

logger = logging.getLogger(__name__)


class OsuAPIService:
    def __init__(self):
        self.client = Client.from_credentials(OsuAPIConfig.OSU_CLIENT_ID, OsuAPIConfig.OSU_CLIENT_SECRET,
                                              OsuAPIConfig.redirect_url)
        self.collection = database.get_collection()

    def get_top_scores(self):
        return list(self.collection.find())

    def update_top_scores(self):
        player_ids = self.collection.distinct("_id")

        for idx, player_id in enumerate(player_ids):
            player_top_scores = self.client.get_user_scores(player_id, UserScoreType.BEST, limit=100)
            top_scores = []

            logger.info(f"Updating top scores for player {idx}/{len(player_ids)}")
            for score in player_top_scores:

                mods = score.mods
                mod_string = ''
                for mod in mods:
                    mod_string += mod.mod.value

                score = {
                    "_id": score.id,
                    "background_url": score.beatmapset.background_url,
                    "artist": score.beatmapset.artist,
                    "title": score.beatmapset.title,
                    "creator": score.beatmapset.creator,
                    "max_combo": score.max_combo,
                    "accuracy": score.accuracy,
                    "mods": mod_string,
                    "rank": score.rank.value,
                    "pp": score.pp,
                    "started_at": score.started_at,
                    "ended_at": score.ended_at
                }

                top_scores.append(score)
            self.collection.update_one({"_id": player_id}, {"$set": {"top_scores": top_scores}}, upsert=True)

        logger.info("Updated all top scores")

    def get_player_info(self):
        return list(self.collection.find({}, {"top_scores": 0}))

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
                self.collection.update_one({"_id": stats.user.id}, {"$set": user}, upsert=True)

        logger.info('Updated players')
