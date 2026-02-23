import logging

import pandas as pd

from config.database_config import database
from processing.similarity_calculation import analyze_profiles

logger = logging.getLogger(__name__)


class DataService:
    def __init__(self):
        self.player_collection = database.get_player_collection()
        self.scores_collection = database.get_scores_collection()
        self.player_stats_collection = database.get_player_stats_collection()
        self.global_stats_collection = database.get_global_stats_collection()

    def get_global_stats(self):
        return self.global_stats_collection.find_one({"_id": "global_metrics"}, {"_id": 0})

    def get_player_stats(self, player_id):
        return self.player_stats_collection.find_one({"_id": player_id}, {"_id": 0})

    def update_all_player_stats(self):
        player_ids = self.player_collection.distinct("_id")

        for player_id in player_ids:
            self.update_player_stats(player_id)

        logger.info("Updated all player stats")

    def update_player_stats(self, player_id):
        top_artists = self._calculate_top_artists(player_id=player_id)
        top_songs = self._calculate_top_songs(player_id=player_id)
        top_mods = self._calculate_top_mods(player_id=player_id)
        hour_histogram = self._calculate_top_play_time_histogram(player_id=player_id)

        data = {
            'top_artists': top_artists,
            'top_songs': top_songs,
            'top_mods': top_mods,
            'hour_histogram': hour_histogram,
        }

        self.player_stats_collection.update_one({"_id": player_id}, {"$set": data}, upsert=True)
        logger.info(f"Updated stats for player {player_id}")

    def update_global_stats(self):
        top_artists = self._calculate_top_artists()
        top_songs = self._calculate_top_songs()
        top_mods = self._calculate_top_mods()
        hour_histogram = self._calculate_top_play_time_histogram()
        similarity_coordinates = self._calculate_similarity_coordinates()

        data = {
            'top_artists': top_artists,
            'top_songs': top_songs,
            'top_mods': top_mods,
            'hour_histogram': hour_histogram,
            'similarity_coordinates': similarity_coordinates,
        }

        self.global_stats_collection.update_one({"_id": "global_metrics"}, {"$set": data}, upsert=True)
        logger.info("Updated unified stats")

    def _calculate_similarity_coordinates(self):
        scores = self.scores_collection.find({})
        df = pd.DataFrame(scores)
        return analyze_profiles(df)

    def _calculate_top_artists(self, player_id=None):
        return self._get_top_stat_count('artist', player_id)

    def _calculate_top_songs(self, player_id=None):
        return self._get_top_stat_count('title', player_id)

    def _calculate_top_mods(self, player_id=None):
        return self._get_top_stat_count('mods', player_id)

    def _calculate_top_play_time_histogram(self, player_id=None):
        pipeline = []

        if player_id:
            pipeline.append({"$match": {"user_id": player_id}})

        pipeline.extend([
            {"$project": {"hour": {"$hour": "$ended_at"}}},
            {"$group": {"_id": "$hour", "count": {"$sum": 1}}},
            {"$sort": {"_id": 1}}
        ])

        results = list(self.scores_collection.aggregate(pipeline))

        counts_map = {r['_id']: r['count'] for r in results}
        return [counts_map.get(hour, 0) for hour in range(24)]

    def _get_top_stat_count(self, field_name, player_id=None, limit=5):
        pipeline = []

        if player_id:
            pipeline.append({"$match": {"user_id": player_id}})

        pipeline.extend([
            {"$group": {"_id": f"${field_name}", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": limit},
            {"$project": {"label": "$_id", "count": 1, "_id": 0}}
        ])

        return list(self.scores_collection.aggregate(pipeline))
