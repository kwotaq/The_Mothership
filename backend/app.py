import logging

logging.basicConfig(level=logging.INFO)

from flask import Flask, render_template, jsonify

from services.osu_service import OsuAPIService
from services.data_service import DataService

logger = logging.getLogger(__name__)

osu_service = OsuAPIService()
data_service = DataService()

app = Flask(__name__)

@app.route('/')
def home():
    routes = [
        {'path': '/api/update_top_scores'},
        {'path': '/api/update_player_info_list'},
        {'path': '/api/update_top_score_time_histogram'},
    ]
    return render_template('debug.html', routes=routes)

@app.route('/api/update_top_score_time_histogram')
def update_top_score_time_histogram():
    logger.info('Histogram requested')
    data_service.update_top_play_time_histogram()
    return "OK"

def get_top_scores():
    logger.info('Score list requested')
    score_list = osu_service.get_top_scores()
    logger.info('Score list fetched from database')
    return jsonify(score_list)

@app.route('/api/player_info_list')
def get_player_info():
    logger.info('Player info list requested')
    player_list = osu_service.get_player_info()
    logger.info('Player info list fetched from database')
    return jsonify(player_list)

@app.route('/api/update_top_scores')
def update_top_scores():
    logger.info('Top score list update requested')
    osu_service.update_top_scores()
    return 'OK'

@app.route('/api/update_player_info_list')
def update_player_info_list():
    logger.info('Player info list update requested')
    osu_service.update_player_info_list()
    return 'OK'

if __name__ == '__main__':
    app.run()
    logger.info('Started Application')