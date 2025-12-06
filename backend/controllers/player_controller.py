import logging

from flask import Blueprint, jsonify

from services.osu_service import OsuAPIService

logger = logging.getLogger(__name__)

osu_service = OsuAPIService()

player_controller = Blueprint('player_controller', __name__)

@player_controller.route('/api/update_player_info_list')
def update_player_info_list():
    logger.info('Player info list update requested')
    osu_service.update_player_info_list()
    return 'OK'


@player_controller.route('/api/player_info_list')
def get_player_info():
    logger.info('Player info list requested')
    player_list = osu_service.get_player_info()
    logger.info('Player info list fetched from database')
    return jsonify(player_list)


