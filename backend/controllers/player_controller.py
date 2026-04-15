import logging

from flask import Blueprint, jsonify

from backend.services.osu_api_service import OsuAPIService

logger = logging.getLogger(__name__)

osu_service = OsuAPIService()

players_bp = Blueprint('players', __name__)

@players_bp.route('/api/players')
def get_players():
    logger.info('Player info list requested')
    player_list = osu_service.get_players()
    logger.info('Player info list fetched from database')
    return jsonify(player_list)


