import logging
import pandas as pd
from tqdm import tqdm
from config.database_config import database
from processing.similarity_calculation import analyze_profiles

logger = logging.getLogger(__name__)

class DataService:
    def __init__(self):
        self.player_collection = database.get_player_collection()
        self.scores_collection = database.get_scores_collection()
        self.player_stats_collection = database.get_player_stats_collection()
        self.global_stats_collection = database.get_global_stats_collection()

    def get_global_player_metrics(self):
        return self.global_stats_collection.find_one({"_id": "global_player_metrics"}, {"_id": 0})

    def get_global_score_metrics(self):
        return self.global_stats_collection.find_one({"_id": "global_score_metrics"}, {"_id": 0})

    def get_player_stats(self, player_id):
        return self.player_stats_collection.find_one({"_id": player_id}, {"_id": 0})

    def get_similarity_coordinates(self):
        return self.global_stats_collection.find_one(
            {"_id": "similarity_coordinates"},
            {"_id": 0, "similarity_coordinates": 1}
        )

    def update_all_player_stats(self):
        player_ids = self.player_collection.distinct("_id")

        for player_id in tqdm(player_ids, desc="Updating Player Stats", unit="player"):
            self.update_player_stats(player_id)

    def update_similarity_coordinates(self):
        data = {"similarity_coordinates": self._calculate_similarity_coordinates()}
        self.global_stats_collection.update_one({"_id": "similarity_coordinates"}, {"$set": data}, upsert=True)

    def update_player_stats(self, player_id):
        top_artists = self._get_top_stat_count('artist', player_id)
        top_songs = self._get_top_stat_count('title', player_id)
        top_mods = self._get_top_stat_count('mods', player_id, results_limit=10)
        hour_histogram = self._calculate_top_play_time_histogram(player_id=player_id)

        data = {
            'top_artists': top_artists,
            'top_songs': top_songs,
            'top_mods': top_mods,
            'hour_histogram': hour_histogram,
        }

        self.player_stats_collection.update_one({"_id": player_id}, {"$set": data}, upsert=True)

    def update_global_player_metrics(self):
        top_artists = self._get_top_stat_count('artist')
        top_songs = self._get_top_stat_count('title')
        top_mods = self._get_top_stat_count('mods', results_limit=10)
        hour_histogram = self._calculate_top_play_time_histogram()

        data = {
            'top_artists': top_artists,
            'top_songs': top_songs,
            'top_mods': top_mods,
            'hour_histogram': hour_histogram,
        }

        self.global_stats_collection.update_one({"_id": "global_player_metrics"}, {"$set": data}, upsert=True)


    def update_global_score_metrics(self):
        top_players = self._get_top_stat_count('user_id', results_limit=10, top_scores_limit=200)
        top_mappers = self._get_top_stat_count('creator', results_limit=5, top_scores_limit=200)

        data = {
            'top_players': top_players,
            'top_mappers': top_mappers,
        }

        self.global_stats_collection.update_one({"_id": "global_score_metrics"}, {"$set": data}, upsert=True)

    def _calculate_similarity_coordinates(self):
        scores = self.scores_collection.find({})
        df = pd.DataFrame(scores)
        return analyze_profiles(df)

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

    def _get_top_stat_count(self, field_name, player_id=None, results_limit=5, top_scores_limit=None):
        pipeline = []

        if player_id:
            pipeline.append({"$match": {"user_id": player_id}})

        if top_scores_limit:
            pipeline.extend([
                {"$sort": {"pp": -1}},
                {"$limit": top_scores_limit}
            ])

        pipeline.extend([
            {"$group": {"_id": f"${field_name}", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": results_limit},
            {"$project": {"label": "$_id", "count": 1, "_id": 0}}
        ])

        return list(self.scores_collection.aggregate(pipeline))
