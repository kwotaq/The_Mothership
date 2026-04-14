import gevent.monkey
gevent.monkey.patch_all()

import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(name)s %(levelname)s %(message)s')

from tasks import sync_player_all

logger = logging.getLogger(__name__)
logger.info('Starting Application')

from services.osu_stream_service import OsuStreamService
from controllers.metrics_controller import metrics_bp
from controllers.player_controller import players_bp
from controllers.score_controller import scores_bp

from flask import Flask
from flask_socketio import SocketIO

def on_new_top_score(player_id):
    sync_player_all.delay(player_id)
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='gevent', transports=['websocket'])
OsuStreamService().init_app(socketio,on_new_top_score=on_new_top_score)
app.register_blueprint(players_bp)
app.register_blueprint(scores_bp)
app.register_blueprint(metrics_bp)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='127.0.0.1', port=5000, use_reloader=False)