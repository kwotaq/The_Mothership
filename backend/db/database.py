from pymongo import MongoClient
import os

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

class Database:
    def __init__(self):
        self.client = MongoClient(os.getenv('DB_URL'))
        self.db = self.client['osu!apiData']

    def get_collection(self):
        return self.db['players']


database = Database()
