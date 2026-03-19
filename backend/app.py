import logging

logging.basicConfig(level=logging.INFO)

from controllers.data_controller import data_controller
from controllers.player_controller import player_controller
from controllers.score_controller import score_controller, osu_stream_service

from flask import Flask, render_template
from flask_socketio import SocketIO

logger = logging.getLogger(__name__)

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/')
def home():
    routes = [
        {'path': '/api/admin/scores/update'},
        {'path': '/api/admin/players/update'},
        {'path': '/api//api/admin/metrics/player/global/update'},
        {'path': '/api/admin/metrics/score/global/update'},
        {'path': '/api/admin/metrics/player/individual'},
        {'path': '/api/admin/metrics/similarity'},
    ]
    return render_template('debug.html', routes=routes)


app.register_blueprint(player_controller)
app.register_blueprint(score_controller)
app.register_blueprint(data_controller)

osu_stream_service.init_app(socketio)

if __name__ == '__main__':
    app.run()
    socketio.run(app, debug=True)
    logger.info('Started Application')
