import json
import logging
import threading
import time
from datetime import datetime

import websocket
from flask_socketio import SocketIO

from config.database_config import database

logger = logging.getLogger(__name__)

class OsuStreamService:
    def __init__(self):
        self.socketio = None
        self.is_running = False
        self.scores_collection = database.get_recent_scores_collection()
        self.greek_user_ids = set()

    def init_app(self, socketio: SocketIO):
        self.socketio = socketio
        self._load_greek_ids()

        if not self.is_running:
            self.is_running = True
            thread = threading.Thread(target=self._run_listener, daemon=True)
            thread.start()

    def _load_greek_ids(self):
        try:
            player_coll = database.get_player_collection()
            self.greek_user_ids = set(player_coll.distinct("_id"))
            logger.info(f"OsuStreamService: Loaded {len(self.greek_user_ids)} Greek IDs.")
        except Exception as e:
            logger.error(f"OsuStreamService: DB load failed: {e}")

    def _run_listener(self):
        uri = "ws://127.0.0.1:7727"
        while True:
            try:
                ws = websocket.create_connection(uri)

                last = self.scores_collection.find_one(sort=[("ended_at", -1)])
                last = str(last["_id"]) if last else "connect"
                ws.send(last)

                while True:
                    message = ws.recv()
                    raw_data = json.loads(message)
                    u_id = str(raw_data.get('user_id', ''))

                    if u_id in self.greek_user_ids:
                        raw_date = raw_data.get('ended_at')
                        bson_date = None
                        if raw_date:
                            bson_date = datetime.fromisoformat(raw_date.replace('Z', '+00:00'))

                        formatted_score = {
                            "_id": str(raw_data.get('id')),
                            "user_id": u_id,
                            "pp": raw_data.get('pp'),
                            "ended_at": bson_date
                        }

                        try:
                            self.scores_collection.insert_one(formatted_score)
                        except Exception as e:
                            logger.error(f"Failed to cache score: {e}")

                        if self.socketio:
                            live_payload = {**formatted_score, "ended_at": bson_date.isoformat()}
                            self.socketio.emit('new_live_score', live_payload)

            except Exception as e:
                logger.warning(f"OsuStreamService: Connection error: {e}")
                time.sleep(5)


osu_service = OsuStreamService()
