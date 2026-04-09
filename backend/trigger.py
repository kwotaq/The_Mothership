import sys
from tasks import sync_players, sync_all_scores, sync_metrics, sync_all, sync_score_metrics, sync_player_metrics, sync_similarity_coordinates, sync_scheduled, sync_x_scores

tasks = {
    'players': sync_players,
    'scores': sync_all_scores,
    'xscores': sync_x_scores,
    'metrics': sync_metrics,
    'metrics:coordinates': sync_similarity_coordinates,
    'metrics:player': sync_player_metrics,
    'metrics:score': sync_score_metrics,
    'all': sync_all,
    'scheduled': sync_scheduled
}

if len(sys.argv) < 2 or sys.argv[1] not in tasks:
    print(f"Usage: python trigger.py <task>")
    print(f"Available tasks: {', '.join(tasks.keys())}")
    sys.exit(1)

task_name = sys.argv[1]
args = sys.argv[2:]

tasks[task_name].delay(*args)
print(f"Triggered: {task_name} with args: {args}")