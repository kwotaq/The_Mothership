import logging
import os

from dotenv import load_dotenv, find_dotenv
from pymongo import MongoClient

logger = logging.getLogger(__name__)

load_dotenv(find_dotenv())


class Database:
    def __init__(self):
        self.client = MongoClient(os.getenv('DB_URL'))
        self.db = self.client['osu!apiData']
        self.create_indexes()

    def get_player_collection(self):
        return self.db['players']

    def get_scores_collection(self):
        return self.db['scores']

    def get_player_stats_collection(self):
        return self.db['player_stats']

    def get_global_stats_collection(self):
        return self.db['global_stats']

    def create_indexes(self):
        logger.info('Running indexing')

        player_collection = self.get_player_collection()
        scores_collection = self.get_scores_collection()

        player_collection.create_index([("performance_points", -1)], background=True)

        scores_collection.create_index("user_id", background=True)
        scores_collection.create_index([("user_id", 1), ("artist", 1)], background=True)
        scores_collection.create_index([("user_id", 1), ("title", 1)], background=True)
        scores_collection.create_index([("user_id", 1), ("mods", 1)], background=True)
        scores_collection.create_index([("user_id", 1), ("ended_at", 1)], background=True)

        logger.info('Indexing finished')


database = Database()
