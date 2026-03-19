import logging

from flask import Blueprint, request, jsonify

from services.data_service import DataService

logger = logging.getLogger(__name__)

data_service = DataService()

data_controller = Blueprint('data_controller', __name__)

@data_controller.route('/api/players/metrics/global')
def get_global_player_metrics():
    logger.info('Global player metrics fetch requested')
    stats = data_service.get_global_player_metrics()
    return jsonify(stats)

@data_controller.route('/api/players/metrics', methods=['POST'])
def get_individual_player_metrics():
    data = request.get_json()
    player_id = data.get('player_id')

    if not player_id:
        return jsonify({"error": "Missing player_id"}), 400

    stats = data_service.get_individual_player_metrics(player_id)
    return jsonify(stats)

@data_controller.route('/api/scores/metrics/global')
def get_global_score_metrics():
    logger.info('Global score metrics fetch requested')
    stats = data_service.get_global_score_metrics()
    return jsonify(stats)

@data_controller.route('/api/players/similarity')
def get_similarity_coordinates():
    logger.info('Similarity coordinates fetch requested')
    coordinates = data_service.get_similarity_coordinates()
    return jsonify(coordinates)


@data_controller.route('/api/admin/metrics/player/global/update')
def update_global_player_metrics():
    logger.info('Global player metrics update requested')
    data_service.update_global_player_metrics()
    return "OK"

@data_controller.route('/api/admin/metrics/score/global/update')
def update_global_score_metrics():
    logger.info('Global score metrics update requested')
    data_service.update_global_score_metrics()
    return "OK"

@data_controller.route('/api/admin/metrics/player/individual')
def update_individual_player_metrics():
    logger.info('Stats update requested for all players')
    data_service.update_individual_player_metrics()
    return "OK"

@data_controller.route('/api/admin/metrics/similarity')
def update_similarity_coordinates():
    logger.info('Similarity coordinate update requested')
    data_service.update_similarity_coordinates()
    return "OK"
