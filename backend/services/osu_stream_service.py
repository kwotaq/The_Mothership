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
        self.greek_player_info = {}
        self.on_new_top_score = None

    def init_app(self, socketio: SocketIO, on_new_top_score = None):
        self.socketio = socketio
        self._load_player_info()
        self.on_new_top_score = on_new_top_score

        if not self.is_running:
            self.is_running = True
            thread = threading.Thread(target=self._run_listener, daemon=True)
            thread.start()

    def _load_player_info(self):
        try:
            players = database.get_player_collection()
            scores = database.get_scores_collection()

            player_ids = list(players.distinct("_id"))

            pipeline = [
                {"$match": {"user_id": {"$in": player_ids}}},
                {"$sort": {"pp": 1}},
                {"$group": {"_id": "$user_id", "bottom_score": {"$first": "$pp"}}}
            ]
            bottom_scores = {r["_id"]: r["bottom_score"] for r in scores.aggregate(pipeline)}

            self.greek_player_info = {
                player_id: {"bottom_score": bottom_scores.get(player_id, 0)}
                for player_id in player_ids
            }

            logger.info(f"OsuStreamService: Loaded {len(self.greek_player_info)} Greek players.")
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

                    if u_id in self.greek_player_info:
                        score_pp = raw_data.get('pp')
                        if score_pp is not None and self.greek_player_info[u_id]["bottom_score"] is None or self.greek_player_info[u_id]["bottom_score"] < score_pp:
                            self.on_new_top_score(u_id)

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
