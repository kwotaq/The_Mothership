import logging

from flask import Blueprint, jsonify

from services.osu_api_service import OsuAPIService

logger = logging.getLogger(__name__)

osu_service = OsuAPIService()

player_controller = Blueprint('player_controller', __name__)

@player_controller.route('/api/admin/players/update')
def update_all_player_info():
    logger.info('Player info list update requested')
    osu_service.update_all_player_info()
    return 'OK'


@player_controller.route('/api/players')
def get_all_player_info():
    logger.info('Player info list requested')
    player_list = osu_service.get_all_player_info()
    logger.info('Player info list fetched from database')
    return jsonify(player_list)


