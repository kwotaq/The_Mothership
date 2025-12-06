import pandas as pd

from similarity_calculation import SimilarityCalculator

def top_play_hour_histogram(date_list):
    df = pd.DataFrame({'dates': date_list})
    df = df.groupby(df["dates"].dt.hour).count()
    return df["dates"].tolist()

def profile_similarities(scores):
    df = pd.DataFrame(scores)
    similarity_calculator = SimilarityCalculator(df)
    similarity_calculator.calculate_similarity()
