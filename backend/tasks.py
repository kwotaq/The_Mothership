import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from celery import Celery, chain

celery = Celery('tasks', broker='redis://localhost:6379/0')


@celery.task
def sync_players():
    from services.osu_api_service import OsuAPIService
    OsuAPIService().update_player_info_by_page()


@celery.task
def sync_all_scores():
    from services.osu_api_service import OsuAPIService
    OsuAPIService().update_all_top_scores()


@celery.task
def sync_player_all(player_id):
    from services.osu_api_service import OsuAPIService
    OsuAPIService().update_player_info(player_id)
    OsuAPIService().update_player_top_scores(player_id)


@celery.task
def sync_similarity_coordinates():
    from services.metrics_service import MetricsService
    MetricsService().update_similarity_coordinates()


@celery.task
def sync_player_metrics():
    from services.metrics_service import MetricsService
    service = MetricsService()
    service.update_global_player_metrics()
    service.update_individual_player_metrics()


@celery.task
def sync_score_metrics():
    from services.metrics_service import MetricsService
    MetricsService().update_global_score_metrics()


@celery.task
def sync_metrics():
    chain(
        sync_similarity_coordinates.si(),
        sync_player_metrics.si(),
        sync_score_metrics.si()
    ).apply_async()


@celery.task
def sync_all():
    chain(
        sync_players.si(),
        sync_all_scores.si(),
        sync_metrics.si()
    ).apply_async()


@celery.task
def sync_scheduled():
    chain(
        sync_players.si(),
        sync_metrics.si(),
    ).apply_async()


celery.conf.beat_schedule = {
    'sync-every-3-hours': {
        'task': 'tasks.sync_scheduled',
        'schedule': 3600 * 3,
    },
}
