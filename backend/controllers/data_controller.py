import logging

from flask import Blueprint, jsonify

from services.data_service import DataService

logger = logging.getLogger(__name__)

data_service = DataService()

data_controller = Blueprint('data_controller', __name__)

@data_controller.route('/api/update_global_stats')
def update_global_stats():
    logger.info('Player stats update requested')
    data_service.update_global_stats()
    return "OK"

@data_controller.route('/api/get_global_stats')
def get_global_stats():
    logger.info('Player stats fetch requested')
    stats = data_service.get_global_stats()
    logger.info('Player stats fetch requested')
    return jsonify(stats)