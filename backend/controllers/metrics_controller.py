import logging

from flask import Blueprint, request, jsonify

from services.metrics_service import MetricsService

logger = logging.getLogger(__name__)

metrics_service = MetricsService()

metrics_bp = Blueprint('metrics', __name__)

@metrics_bp.route('/api/players/metrics/global')
def get_global_player_metrics():
    logger.info('Global player metrics fetch requested')
    stats = metrics_service.get_global_player_metrics()
    return jsonify(stats)

@metrics_bp.route('/api/players/metrics', methods=['POST'])
def get_all_player_metrics():
    data = request.get_json()
    player_id = data.get('player_id')

    if not player_id:
        return jsonify({"error": "Missing player_id"}), 400

    stats = metrics_service.get_player_metrics(player_id)
    return jsonify(stats)

@metrics_bp.route('/api/scores/metrics/global')
def get_global_score_metrics():
    logger.info('Global score metrics fetch requested')
    stats = metrics_service.get_global_score_metrics()
    return jsonify(stats)

@metrics_bp.route('/api/players/similarity')
def get_similarity():
    logger.info('Similarity coordinates fetch requested')
    coordinates = metrics_service.get_similarity()
    return jsonify(coordinates)

