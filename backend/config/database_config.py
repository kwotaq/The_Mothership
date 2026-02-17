from pymongo import MongoClient
import os

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

class Database:
    def __init__(self):
        self.client = MongoClient(os.getenv('DB_URL'))
        self.db = self.client['osu!apiData']

    def get_player_collection(self):
        return self.db['players']

    def get_scores_collection(self):
        return self.db['scores']

    def get_player_stats_collection(self):
        return self.db['player_stats']

    def get_unified_stats_collection(self):
        return self.db['unified_stats']

database = Database()
