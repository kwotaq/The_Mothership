import pandas as pd

from processing.similarity_calculation import analyze_profiles


def top_play_hour_histogram(date_list):
    df = pd.DataFrame.from_dict(date_list)
    df = df.groupby(df["ended_at"].dt.hour).size()
    return df.tolist()


def most_common_x(x_list, x_label):
    df = pd.DataFrame.from_dict(x_list)
    df_counts = df.groupby(x_label).size().reset_index(name='count')
    df_top = df_counts.sort_values(by='count', ascending=False).rename(columns={x_label: 'label'}).head(5)
    return df_top.to_dict('records')


def profile_similarity_coordinates(scores):
    df = pd.DataFrame(scores)
    return analyze_profiles(df)
