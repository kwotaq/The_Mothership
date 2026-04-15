import logging

from flask import Blueprint, jsonify

from services.osu_api_service import OsuAPIService

logger = logging.getLogger(__name__)

osu_api_service = OsuAPIService()
scores_bp = Blueprint('scores', __name__)


@scores_bp.route('/api/scores')
def get_scores():
    logger.info('Top scores requested')
    score_list = osu_api_service.get_scores()
    logger.info(f'Top scores fetched from database')
    return jsonify(score_list)

@scores_bp.route('/api/scores/recent')
def get_recent_scores():
    logger.info('Recent scores requested')
    score_list = osu_api_service.get_recent_scores()
    logger.info(f'Recent scores fetched from database')
    return jsonify(score_list)
