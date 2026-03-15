import logging

logging.basicConfig(level=logging.INFO)

from controllers.data_controller import data_controller
from controllers.player_controller import player_controller
from controllers.score_controller import score_controller

from flask import Flask, render_template

logger = logging.getLogger(__name__)

app = Flask(__name__)


@app.route('/')
def home():
    routes = [
        {'path': '/api/update_all_top_scores'},
        {'path': '/api/update_all_player_info'},
        {'path': '/api/update_global_player_metrics'},
        {'path': '/api/update_global_score_metrics'},
        {'path': '/api/update_individual_player_metrics'},
        {'path': '/api/update_similarity_coordinates'},
    ]
    return render_template('debug.html', routes=routes)


app.register_blueprint(player_controller)
app.register_blueprint(score_controller)
app.register_blueprint(data_controller)

if __name__ == '__main__':
    app.run()
    logger.info('Started Application')
