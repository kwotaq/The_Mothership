import logging
import math

import pandas as pd
from tqdm import tqdm

from config.database_config import database
from processing.similarity_calculation import analyze_profiles

logger = logging.getLogger(__name__)


class MetricsService:
    def __init__(self):
        self.player_collection = database.get_player_collection()
        self.scores_collection = database.get_scores_collection()
        self.player_stats_collection = database.get_player_stats_collection()
        self.global_stats_collection = database.get_global_stats_collection()

    def get_global_player_metrics(self):
        return self.global_stats_collection.find_one({"_id": "global_player_metrics"}, {"_id": 0})

    def get_global_score_metrics(self):
        return self.global_stats_collection.find_one({"_id": "global_score_metrics"}, {"_id": 0})

    def get_player_metrics(self, player_id):
        return self.player_stats_collection.find_one({"_id": player_id}, {"_id": 0})

    def get_similarity(self):
        return self.global_stats_collection.find_one(
            {"_id": "similarity_coordinates"},
            {"_id": 0, "similarity_coordinates": 1}
        )

    def sync_all_player_metrics(self):
        player_ids = self.player_collection.distinct("_id")

        for player_id in tqdm(player_ids, desc="Updating Player Stats", unit="player"):
            self.sync_player_metrics(player_id)

    def sync_player_metrics(self, player_id):
        top_artists = self._aggregate_stat('artist', player_id, results_limit=7)
        top_songs = self._aggregate_stat('title', player_id, results_limit=7)
        top_mods = self._aggregate_stat('mods', player_id, results_limit=10)
        top_mappers = self._aggregate_stat('creator', player_id, results_limit=7)
        hour_histogram = self._aggregate_stat("hour", player_id=player_id)
        recent_scores = self._get_recent_scores(player_id=player_id, results_limit=5)
        bpm_histogram = self._aggregate_stat("bpm", player_id=player_id)
        year_created_histogram = self._aggregate_stat("year", player_id=player_id)

        data = {
            'top_artists': top_artists,
            'top_songs': top_songs,
            'top_mods': top_mods,
            'top_mappers': top_mappers,
            'hour_histogram': hour_histogram,
            'recent_scores': recent_scores,
            'bpm_histogram': bpm_histogram,
            'year_created_histogram': year_created_histogram,
        }

        self.player_stats_collection.update_one({"_id": player_id}, {"$set": data}, upsert=True)

    def sync_similarity(self):
        data = {"similarity_coordinates": self._compute_similarity()}
        self.global_stats_collection.update_one({"_id": "similarity_coordinates"}, {"$set": data}, upsert=True)

        player_ids = self.player_collection.distinct("_id")
        for player_id in tqdm(player_ids, desc="Updating Similarities", unit="player"):
            closest_neighbours = self._compute_closest_neighbours(player_id, results_limit=5)
            self.player_stats_collection.update_one({"_id": player_id},
                                                    {"$set": {"closest_neighbours": closest_neighbours}}, upsert=True)

    def sync_global_player_metrics(self):
        top_artists = self._aggregate_stat('artist', results_limit=10)
        top_songs = self._aggregate_stat('title', results_limit=10)
        top_mods = self._aggregate_stat('mods', results_limit=10)
        top_mappers = self._aggregate_stat('creator', results_limit=10)
        hour_histogram = self._aggregate_stat("hour")
        bpm_histogram = self._aggregate_stat("bpm")
        year_created_histogram = self._aggregate_stat("year")

        data = {
            'top_artists': top_artists,
            'top_songs': top_songs,
            'top_mods': top_mods,
            'top_mappers': top_mappers,
            'hour_histogram': hour_histogram,
            'bpm_histogram': bpm_histogram,
            'year_created_histogram': year_created_histogram,
        }

        self.global_stats_collection.update_one({"_id": "global_player_metrics"}, {"$set": data}, upsert=True)

    def sync_global_score_metrics(self):
        top_players = self._aggregate_stat('user_id', results_limit=10, top_scores_limit=200)
        top_mappers = self._aggregate_stat('creator', results_limit=7, top_scores_limit=200)
        recent_scores = self._get_recent_scores(results_limit=10, top_scores_limit=200)

        data = {
            'top_players': top_players,
            'top_mappers': top_mappers,
            'recent_scores': recent_scores
        }

        self.global_stats_collection.update_one({"_id": "global_score_metrics"}, {"$set": data}, upsert=True)

    def _compute_similarity(self):
        scores = self.scores_collection.find({})
        df = pd.DataFrame(scores)
        return analyze_profiles(df)

    def _compute_closest_neighbours(self, user_id, results_limit=5):
        doc = self.global_stats_collection.find_one({"_id": "similarity_coordinates"})
        if not doc: return []

        all_players = doc.get("similarity_coordinates", [])
        user_id = str(user_id)

        target = next((p for p in all_players if p['user_id'] == user_id), None)
        if not target: return []

        tx, ty = target['x'], target['y']
        raw_results = []

        for p in all_players:
            if p['user_id'] == user_id: continue

            distance = math.sqrt((p['x'] - tx) ** 2 + (p['y'] - ty) ** 2)
            raw_results.append({"label": p['user_id'], "distance": distance})

        if not raw_results: return []

        distances = [r["distance"] for r in raw_results]
        max_distance = max(distances)

        for r in raw_results:
            normalized = r["distance"] / max_distance
            score = (1 - normalized ** 0.35) * 100
            r["count"] = round(score, 1)

        raw_results.sort(key=lambda x: x["count"], reverse=True)
        return raw_results[:results_limit]

    def _aggregate_stat(self, field_name, player_id=None, results_limit=None, top_scores_limit=None):
        pipeline = []

        if player_id:
            pipeline.append({"$match": {"user_id": player_id}})

        if top_scores_limit:
            pipeline.extend([
                {"$sort": {"pp": -1}},
                {"$limit": top_scores_limit}
            ])

        if field_name == "hour":
            pipeline.append({
                "$project": {
                    "val": {"$hour": {"date": "$ended_at", "timezone": "Europe/Athens"}}
                }
            })
            group_id = "$val"
        elif field_name == "year":
            pipeline.append({
                "$project": {
                    "val": {"$year": {"date": "$last_updated", "timezone": "Europe/Athens"}}
                }
            })
            group_id = "$val"

        elif field_name == "bpm":
            pipeline.append({
                "$project": {
                    "val": {
                        "$subtract": [
                            "$bpm",
                            {"$mod": ["$bpm", 5]}
                        ]
                    }
                }
            })
            group_id = "$val"
        else:
            group_id = f"${field_name}"

        pipeline.append({"$group": {"_id": group_id, "count": {"$sum": 1}}})

        is_number_field = field_name in ["hour", "year", "bpm"]
        sort_order = {"_id": 1} if is_number_field else {"count": -1}
        pipeline.append({"$sort": sort_order})

        if results_limit and results_limit > 0:
            pipeline.append({"$limit": results_limit})

        pipeline.append({
            "$project": {
                "label": {"$toString": "$_id"},
                "count": 1,
                "_id": 0
            }
        })

        results = list(self.scores_collection.aggregate(pipeline))

        if field_name == "hour":
            counts_map = {r['label']: r['count'] for r in results}
            return [
                {"label": str(h), "count": counts_map.get(str(h), 0)}
                for h in range(24)
            ]

        return results

    def _get_recent_scores(self, player_id=None, results_limit=5, top_scores_limit=None):
        pipeline = []

        if player_id:
            pipeline.append({"$match": {"user_id": player_id}})

        if top_scores_limit:
            pipeline.extend([
                {"$sort": {"pp": -1}},
                {"$limit": top_scores_limit}
            ])

        pipeline.extend([
            {"$sort": {"ended_at": -1}},
            {"$limit": results_limit},
        ])

        return list(self.scores_collection.aggregate(pipeline))
