import logging

from controllers.data_controller import data_controller
from controllers.player_controller import player_controller
from controllers.score_controller import score_controller

logging.basicConfig(level=logging.INFO)

from flask import Flask, render_template

logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/')
def home():
    routes = [
        {'path': '/api/update_top_scores'},
        {'path': '/api/update_player_info_list'},
        {'path': '/api/update_global_stats'},
    ]
    return render_template('debug.html', routes=routes)

app.register_blueprint(player_controller)
app.register_blueprint(score_controller)
app.register_blueprint(data_controller)

if __name__ == '__main__':
    app.run()
    logger.info('Started Application')