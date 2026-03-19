import logging

from flask import Blueprint, request, jsonify

from services.osu_api_service import OsuAPIService
from services.osu_stream_service import OsuStreamService

logger = logging.getLogger(__name__)

osu_api_service = OsuAPIService()
osu_stream_service = OsuStreamService()

score_controller = Blueprint('score_controller', __name__)


@score_controller.route('/api/scores/top')
def get_top_scores():
    logger.info('Top scores requested')
    score_list = osu_api_service.get_top_scores()
    logger.info(f'Top scores fetched from database')
    return jsonify(score_list)

@score_controller.route('/api/scores/recent')
def get_recent_scores():
    logger.info('Recent scores requested')
    score_list = osu_api_service.get_recent_scores()
    logger.info(f'Recent scores fetched from database')
    return jsonify(score_list)

@score_controller.route('/api/admin/scores/update')
def update_top_scores():
    logger.info('Top score list update requested')
    osu_api_service.update_all_top_scores()
    return 'OK'