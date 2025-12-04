import os

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())


class OsuAPIConfig:
    OSU_CLIENT_ID = int(os.getenv('OSU_CLIENT_ID'))
    OSU_CLIENT_SECRET = os.getenv('OSU_CLIENT_SECRET')
    redirect_url = None
