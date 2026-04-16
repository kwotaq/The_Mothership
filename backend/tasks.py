import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from celery import Celery, chain

celery = Celery('tasks', broker='redis://localhost:6379/0')


@celery.task
def sync_players():
    from services.osu_api_service import OsuAPIService
    OsuAPIService().sync_players()
    OsuAPIService().sync_redis_cache_all()


@celery.task
def sync_all_scores():
    from services.osu_api_service import OsuAPIService
    OsuAPIService().sync_all_scores()
    OsuAPIService().sync_redis_cache_all()

@celery.task
def sync_x_scores(amount):
    from services.osu_api_service import OsuAPIService
    OsuAPIService().sync_scores_limited(amount)
    OsuAPIService().sync_redis_cache_all()


@celery.task
def sync_player_all(player_id):
    from services.osu_api_service import OsuAPIService
    OsuAPIService().sync_player(player_id)
    OsuAPIService().sync_player_scores(player_id)
    OsuAPIService().sync_redis_cache_all()
    from services.metrics_service import MetricsService
    MetricsService().sync_player_metrics(player_id)
    MetricsService().sync_global_player_metrics()
    MetricsService().sync_global_score_metrics()


@celery.task
def sync_similarity_coordinates():
    from services.metrics_service import MetricsService
    MetricsService().sync_similarity()


@celery.task
def sync_player_metrics():
    from services.metrics_service import MetricsService
    service = MetricsService()
    service.sync_global_player_metrics()
    service.sync_all_player_metrics()


@celery.task
def sync_score_metrics():
    from services.metrics_service import MetricsService
    MetricsService().sync_global_score_metrics()


@celery.task
def sync_metrics():
    chain(
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
    'sync-ever-month': {
        'task': 'tasks.sync_similarity_coordinates',
        'schedule':  3600 * 24 * 30,
    }
}
