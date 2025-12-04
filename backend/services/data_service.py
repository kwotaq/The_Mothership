import logging

from config.database_config import database

logger = logging.getLogger(__name__)


class DataService:
    def __init__(self):
        self.player_collection = database.get_player_collection()
        self.scores_collection = database.get_scores_collection()
        self.data_collection = database.get_processed_data_cache()


    def update_top_play_time_histogram(self):
        score_dates = self.scores_collection.distinct('ended_at')