import logging

from flask import Blueprint, jsonify

from services.osu_service import OsuAPIService

logger = logging.getLogger(__name__)

osu_service = OsuAPIService()

score_controller = Blueprint('score_controller', __name__)

@score_controller.route('/api/get_all_top_scores')
def get_top_scores():
    logger.info('Score list requested')
    score_list = osu_service.get_all_top_scores()
    logger.info('Score list fetched from database')
    return jsonify(score_list)



@score_controller.route('/api/update_all_top_scores')
def update_top_scores():
    logger.info('Top score list update requested')
    osu_service.update_all_top_scores()
    return 'OK'