import logging

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.manifold import TSNE
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler, OneHotEncoder

logger = logging.getLogger(__name__)


def extract_features(user_scores):
    artist_count = user_scores.groupby('artist').size().sort_values(ascending=False)
    creator_count = user_scores.groupby('creator').size().sort_values(ascending=False)
    mod_count = user_scores.groupby('mods').size().sort_values(ascending=False)
    same_song_count = user_scores.groupby('title').size().sort_values(ascending=False)

    unique_artists = len(artist_count)
    unique_creators = len(creator_count)
    max_same_song_count = same_song_count.max()

    avg_acc = user_scores['accuracy'].mean()
    avg_combo = user_scores['max_combo'].mean()

    top_artist = artist_count.idxmax()
    top_creator = creator_count.idxmax()
    top_mod = mod_count.idxmax()
    top_song = same_song_count.idxmax()

    features = {
        'unique_artists': unique_artists,
        'unique_creators': unique_creators,
        'max_same_song_count': max_same_song_count,
        'avg_acc': avg_acc,
        'avg_combo': avg_combo,

        'top_artist': top_artist,
        'top_creator': top_creator,
        'top_mod': top_mod,
        'top_song': top_song,
    }

    return features


def _create_feature_matrix(scores):
    logger.info('Beginning feature extraction...')

    feature_df = pd.DataFrame()
    user_idx = []
    for user_id, user_scores in scores:
        tmp_df = pd.DataFrame([extract_features(user_scores)])
        tmp_df['user_id'] = user_id
        user_idx.append(user_id)
        feature_df = pd.concat([feature_df, tmp_df])

    logger.info('Finished feature extraction.')

    numerical = ['unique_artists', 'unique_creators', 'max_same_song_count',
                 'avg_acc', 'avg_combo']

    categorical = ['top_artist', 'top_creator', 'top_mod', 'top_song']

    preprocessor = ColumnTransformer(
        verbose=True,
        transformers=[
            ('num', StandardScaler(), numerical),
            ('cat', OneHotEncoder(), categorical)
        ])

    feature_matrix = preprocessor.fit_transform(feature_df)

    return feature_matrix, user_idx


def analyze_profiles(scores):
    df = pd.DataFrame.from_dict(scores)
    df = df.groupby('user_id')
    feature_matrix, user_idx = _create_feature_matrix(df)
    similarity_matrix = cosine_similarity(feature_matrix)
    reducer = TSNE(n_components=2, perplexity=40)
    coordinates = reducer.fit_transform(similarity_matrix)
    user_coordinates = {'user_id': user_idx, 'coordinates': coordinates}
    return user_coordinates

