import pandas as pd

class SimilarityCalculator:
    def __init__(self, scores):
        self.score_data = scores


    def extract_features(self):
        score_by_user = self.score_data.groupby('user_id')


    def calculate_similarity(self):
        self.extract_features()