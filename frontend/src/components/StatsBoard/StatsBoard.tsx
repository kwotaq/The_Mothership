import type {PlayerStats} from "../../types/playerStats.ts";
import {StatDetails, type StatItem} from "./StatDetails.tsx";
import type {ScoreStats} from "../../types/scoreStats.ts";
import {usePlayers} from "../../Utility/PlayerContext.tsx";

const isScoreStats = (stats: PlayerStats | ScoreStats): stats is ScoreStats => {
    return (stats as ScoreStats).kind === 'scoreStats';
};

export const StatsBoard = ({stats}: { stats: PlayerStats | ScoreStats }) => {
    const {playerMap} = usePlayers()

    let statsToDisplay: StatItem[];

    if (isScoreStats(stats)) {
        statsToDisplay = [
            {
                label: "Top Players",
                type: 'chart',
                width: 2,
                values: stats.top_players?.map((item) => ({
                    label: playerMap[item.label]?.name || `${item.label}`,
                    count: item.count
                })) || []
            },
            {
                label: "Top Mappers",
                values: stats.top_mappers || [],
                type: 'list',
                width: 1
            },
        ];
    } else {
        statsToDisplay = [
            {label: "Top Plays By Hour", values: stats.hour_histogram || [], type: 'histogram', width: 3},
            {label: "Top Artists", values: stats.top_artists || [], type: 'list', width: 1},
            {label: "Top Songs", values: stats.top_songs || [], type: 'list', width: 1},
            {label: "Top Mods", values: stats.top_mods || [], type: 'chart', width: 1},
        ];
    }

    return (
        <div className="mx-auto w-full">
            <div>
                <StatDetails stats={statsToDisplay}/>
            </div>
        </div>
    )
};