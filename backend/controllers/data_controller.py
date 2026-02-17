import logging

from flask import Blueprint

from services.data_service import DataService

logger = logging.getLogger(__name__)

data_service = DataService()

data_controller = Blueprint('data_controller', __name__)

@data_controller.route('/api/update_unified_stats')
def update_unified_stats():
    logger.info('Player stats update requested')
    data_service.update_unified_stats()
    return "OK"