import logging

logging.basicConfig(level=logging.INFO)

from controllers.metrics_controller import metrics_bp
from controllers.player_controller import players_bp
from controllers.score_controller import scores_bp

from flask import Flask
from flask_socketio import SocketIO
from flask_apscheduler import APScheduler

logger = logging.getLogger(__name__)
scheduler = APScheduler()
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
app.register_blueprint(players_bp)
app.register_blueprint(scores_bp)
app.register_blueprint(metrics_bp)

def synchronize_data():
    with app.app_context():
        from services.metrics_service import MetricsService
        from services.osu_api_service import OsuAPIService
        osu_api_service = OsuAPIService()
        metrics_service = MetricsService()
        osu_api_service.update_all_player_info()
        osu_api_service.update_all_top_scores()
        metrics_service.update_global_player_metrics()
        metrics_service.update_global_score_metrics()
        metrics_service.update_similarity_coordinates()
        metrics_service.update_individual_player_metrics()


if __name__ == '__main__':
    scheduler.init_app(app)

    scheduler.add_job(
        id='data_sync',
        func=synchronize_data,
        trigger='interval',
        hours=3,
    )

    scheduler.start()

    socketio.run(app, debug=True)
