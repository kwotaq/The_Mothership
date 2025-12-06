import logging

from flask import Blueprint

from services.data_service import DataService

logger = logging.getLogger(__name__)

data_service = DataService()

data_controller = Blueprint('data_controller', __name__)

@data_controller.route('/api/update_top_score_time_histogram')
def update_top_score_time_histogram():
    logger.info('Histogram requested')
    data_service.update_top_play_time_histogram()
    return "OK"


@data_controller.route('/api/update_profile_similarities')
def update_profile_similarities():
    logger.info('Histogram requested')
    data_service.update_profile_similarities()
    return "OK"