import logging

from services.osu_stream_service import OsuStreamService

logging.basicConfig(level=logging.INFO)

from controllers.metrics_controller import metrics_bp
from controllers.player_controller import players_bp
from controllers.score_controller import scores_bp

from flask import Flask
from flask_socketio import SocketIO

logger = logging.getLogger(__name__)
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
OsuStreamService().init_app(socketio)
app.register_blueprint(players_bp)
app.register_blueprint(scores_bp)
app.register_blueprint(metrics_bp)

if __name__ == '__main__':
    logger.info('Started Application')
    socketio.run(app, debug=True)