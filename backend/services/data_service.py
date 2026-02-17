import logging

from config.database_config import database
from processing.data_statistic_methods import *

logger = logging.getLogger(__name__)


class DataService:
    def __init__(self):
        self.player_collection = database.get_player_collection()
        self.scores_collection = database.get_scores_collection()
        self.player_stats_collection = database.get_player_stats_collection()
        self.unified_stats_collection = database.get_unified_stats_collection()


    def get_unified_stats(self):
        return self.unified_stats_collection.find_one({"_id": "global_metrics"})

    def update_unified_stats(self):
        top_artists = self.calculate_top_artists()
        top_songs = self.calculate_top_songs()
        hour_histogram = self.calculate_top_play_time_histogram()
        similarity_coordinates = self.calculate_similarity_coordinates()

        data = {
            'top_artists': top_artists,
            'top_songs': top_songs,
            'hour_histogram': hour_histogram,
            'similarity_coordinates': similarity_coordinates,
        }

        self.unified_stats_collection.update_one({"_id": "global_metrics"} , {"$set": data}, upsert=True)
        logger.info("Updated unified stats")


    def calculate_similarity_coordinates(self):
        scores = self.scores_collection.find({})
        return profile_similarity_coordinates(scores)


    def calculate_top_artists(self, id_list=None):
        query = {"_id": {"$in": id_list}} if id_list else {}
        score_artists = self.scores_collection.find(query, {'artist': 1})
        return most_common_x(score_artists, 'artist')

    def calculate_top_songs(self, id_list=None):
        query = {"_id": {"$in": id_list}} if id_list else {}
        score_songs = self.scores_collection.find(query, {'title': 1})
        return most_common_x(score_songs, 'title')

    def calculate_top_play_time_histogram(self, id_list=None):
        query = {"_id": {"$in": id_list}} if id_list else {}
        score_dates = self.scores_collection.find(query, {'ended_at': 1})
        return top_play_hour_histogram(score_dates)