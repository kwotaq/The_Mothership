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
    return jsonify(stats)

@data_controller.route('/api/update_all_player_stats')
def update_all_player_stats():
    logger.info('Stats update requested for all players')
    data_service.update_all_player_stats()
    return "OK"


from flask import request, jsonify

@data_controller.route('/api/get_player_stats', methods=['POST'])
def get_player_stats():
    data = request.get_json()
    player_id = data.get('player_id')

    if not player_id:
        return jsonify({"error": "Missing player_id"}), 400

    stats = data_service.get_player_stats(player_id)
    return jsonify(stats)

@data_controller.route('/api/get_similarity_coordinates')
def get_similarity_coordinates():
    logger.info('Similarity coordinates fetch requested')
    coordinates = data_service.get_similarity_coordinates()
    return jsonify(coordinates)

@data_controller.route('/api/update_similarity_coordinates')
def update_similarity_coordinates():
    logger.info('Similarity coordinate update requested')
    data_service.update_similarity_coordinates()
    return "OK"
