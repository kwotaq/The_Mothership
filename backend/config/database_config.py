import logging
import os

from dotenv import load_dotenv, find_dotenv
from pymongo import MongoClient

logger = logging.getLogger(__name__)

load_dotenv(find_dotenv())


class Database:
    def __init__(self):
        self.client = MongoClient(os.getenv('DB_URL'))
        try:
            self.client.admin.command('ping')
            logger.info('Connected to MongoDB')
        except Exception as e:
            logger.error(f'MongoDB connection failed: {e}')

        self.db = self.client['data']
        self.create_indexes()

    def get_player_collection(self):
        return self.db['players']

    def get_scores_collection(self):
        return self.db['scores']

    def get_recent_scores_cache(self):
        if 'recent_scores_cache' not in self.db.list_collection_names():
            self.db.create_collection(
                'recent_scores_cache',
                timeseries={
                    'timeField': 'ended_at',
                    'metaField': 'user_id',
                    'granularity': 'seconds'
                },
                expireAfterSeconds=259200
            )
        return self.db['recent_scores_cache']

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
