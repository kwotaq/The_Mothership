import logging

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from umap import UMAP

logger = logging.getLogger(__name__)


def extract_features(user_scores):
    artist_count = user_scores.groupby('artist').size().sort_values(ascending=False)
    creator_count = user_scores.groupby('creator').size().sort_values(ascending=False)
    mod_count = user_scores.groupby('mods').size().sort_values(ascending=False)
    same_song_count = user_scores.groupby('title').size().sort_values(ascending=False)
    most_common_year = user_scores['last_updated'].dt.year.mode()[0]

    unique_artists = len(artist_count)
    unique_creators = len(creator_count)
    max_same_song_count = same_song_count.max()

    avg_acc = user_scores['accuracy'].mean()
    avg_combo = user_scores['max_combo'].mean()
    avg_pp = user_scores['pp'].mean()
    avg_bpm = user_scores['bpm'].mean()

    top_artist = artist_count.idxmax()
    top_creator = creator_count.idxmax()
    top_mod = mod_count.idxmax()
    top_song = same_song_count.idxmax()

    features = {
        'unique_artists': unique_artists,
        'unique_creators': unique_creators,
        'max_same_song_count': max_same_song_count,
        'most_common_year': most_common_year,
        'avg_acc': avg_acc,
        'avg_combo': avg_combo,
        'avg_pp': avg_pp,
        'avg_bpm': avg_bpm,

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
                 'avg_acc', 'avg_combo', 'avg_pp', 'most_common_year', 'avg_bpm', ]
    categorical = ['top_artist', 'top_creator', 'top_mod', 'top_song']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical)
        ])

    feature_matrix = preprocessor.fit_transform(feature_df)

    if hasattr(feature_matrix, "toarray"):
        feature_matrix = feature_matrix.toarray()

    feature_weights = {
        'num__unique_artists': 1.3,
        'num__unique_creators': 1.8,
        'num__max_same_song_count': 1.0,
        'num__most_common_year': 1.2,
        'num__avg_acc': 1.1,
        'num__avg_pp': 1.2,
        'num__avg_combo': 1.0,
        'num__avg_bpm': 1.6,

        'cat__top_mod': 2.5,
        'cat__top_artist': 1.4,
        'cat__top_creator': 1.4,
        'cat__top_song': 0.9,
    }

    feature_names = preprocessor.get_feature_names_out()

    for i, col_name in enumerate(feature_names):
        for prefix, weight in feature_weights.items():
            if col_name.startswith(prefix):
                feature_matrix[:, i] *= weight
                break

    return feature_matrix, user_idx


def analyze_profiles(scores):
    df = pd.DataFrame.from_dict(scores)
    df = df.groupby('user_id')
    feature_matrix, user_idx = _create_feature_matrix(df)
    similarity_matrix = cosine_similarity(feature_matrix)
    reducer = UMAP(n_components=2, n_neighbors=8, min_dist=0.01, spread=1.0, n_epochs=500, random_state=727)
    coordinates = reducer.fit_transform(similarity_matrix)
    coordinates[:, 0] = (coordinates[:, 0] - coordinates[:, 0].min()) / (coordinates[:, 0].max() - coordinates[:, 0].min()) * 20 - 10
    coordinates[:, 1] = (coordinates[:, 1] - coordinates[:, 1].min()) / (coordinates[:, 1].max() - coordinates[:, 1].min()) * 20 - 10
    formatted_coordinates = [
        {
            "user_id": str(uid),
            "x": float(coord[0]),
            "y": float(coord[1])
        }
        for uid, coord in zip(user_idx, coordinates)
    ]

    return formatted_coordinates
