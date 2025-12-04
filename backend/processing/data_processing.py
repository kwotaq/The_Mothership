import pandas as pd

def top_play_hour_histogram(date_list):
    df = pd.DataFrame({'dates': date_list})
    df = df.groupby(df["dates"].dt.hour).count()
    return df["dates"].tolist()

