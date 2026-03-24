import logging
import click
from flask import Flask
from flask.cli import AppGroup, with_appcontext

from services.metrics_service import MetricsService
from services.osu_api_service import OsuAPIService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

player_cli = AppGroup('players')
metrics_cli = AppGroup('metrics')
scores_cli = AppGroup('scores')


@metrics_cli.command('update')
@click.argument('target', type=click.Choice([
    'global-player',
    'global-score',
    'individual-player',
    'similarity-coordinates'
]))
@with_appcontext
def update_metrics(target):
    service = MetricsService()
    logger.info(f"Starting update for: {target}")

    if target == 'global-player':
        service.update_global_player_metrics()
    elif target == 'global-score':
        service.update_global_score_metrics()
    elif target == 'individual-player':
        service.update_individual_player_metrics()
    elif target == 'similarity-coordinates':
        service.update_similarity_coordinates()

    click.secho(f"Successfully updated {target}")


@player_cli.command('update')
@with_appcontext
def update_all_players():
    service = OsuAPIService()
    logger.info("Updating all player info...")
    service.update_all_player_info()
    click.secho("Player update complete")


@scores_cli.command('update')
@with_appcontext
def update_scores():
    service = OsuAPIService()
    logger.info("Updating top scores...")
    service.update_all_top_scores()
    click.secho("Score update complete")


def create_app():
    cli_app = Flask(__name__)

    cli_app.cli.add_command(player_cli)
    cli_app.cli.add_command(metrics_cli)
    cli_app.cli.add_command(scores_cli)

    return cli_app


app = create_app()