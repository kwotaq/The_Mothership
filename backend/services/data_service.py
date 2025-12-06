import logging

from config.database_config import database
from processing.data_statistic_methods import *

logger = logging.getLogger(__name__)


class DataService:
    def __init__(self):
        self.player_collection = database.get_player_collection()
        self.scores_collection = database.get_scores_collection()
        self.data_collection = database.get_processed_data_cache()


    def update_similarity_coordinates(self):
        scores = self.scores_collection.find({})
        profile_similarity_coordinates(scores)


    def update_top_artists(self):
        score_artists = self.scores_collection.find({}, {'artist': 1, '_id': 0})
        top_artists = most_common_x(score_artists, 'artist')


    def update_top_play_time_histogram(self):
        score_dates = self.scores_collection.find({}, {'ended_at': 1, "_id": 0})
        histogram = top_play_hour_histogram(score_dates)
        # self.data_collection.update_one("top_play_hour_histogram", {"$set": histogram}, upsert=True)
