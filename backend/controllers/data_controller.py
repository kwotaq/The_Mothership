import logging

from flask import Blueprint

from services.data_service import DataService

logger = logging.getLogger(__name__)

data_service = DataService()

data_controller = Blueprint('data_controller', __name__)

@data_controller.route('/api/update_similarity_coordinates')
def update_similarity_coordinates():
    logger.info('Similarity coordinates update requested')
    data_service.update_similarity_coordinates()
    return "OK"

@data_controller.route('/api/update_top_artists')
def update_top_artists():
    logger.info('Top artist update requested')
    data_service.update_top_artists()
    return "OK"


@data_controller.route('/api/update_top_score_time_histogram')
def update_top_score_time_histogram():
    logger.info('Histogram requested')
    data_service.update_top_play_time_histogram()
    return "OK"
