import type {PlayerMetrics} from "../../types/playerMetrics.ts";
import {StatDetails, type StatItem} from "./StatDetails.tsx";
import type {ScoreMetrics} from "../../types/scoreMetrics.ts";
import {usePlayers} from "../../utility/context/playerContext.tsx";
import type {GlobalMetrics} from "../../types/globalMetrics.ts";

export const StatsBoard = ({stats}: { stats: PlayerMetrics | ScoreMetrics | GlobalMetrics }) => {
        const {playerMap} = usePlayers();

        const isScore = (s: any): s is ScoreMetrics => s.kind === 'scoreMetrics';
        const isPlayer = (s: any): s is PlayerMetrics => s.kind === 'playerMetrics';

        if (isScore(stats)) {
            return (
                <div className="mx-auto w-full">
                    <StatDetails stats={[
                        {
                            label: "Recent Tops",
                            type: 'score' as const, // Our new case
                            width: 3 as const,
                            values: stats.recent_scores?.map(score => ({
                                label: playerMap[score.user_id]?.name || "Unknown",
                                count: Math.round(score.pp),
                                info: {
                                    artist: score.artist,
                                    title: score.title,
                                    date: score.ended_at,
                                    score_id: score._id,
                                    user_id: score.user_id
                                }
                            })) || []
                        },
                        {
                            label: "Top Players",
                            type: 'chart',
                            width: 2,
                            values: stats.top_players?.map((item) => ({
                                label: playerMap[item.label]?.name || `${item.label}`,
                                count: item.count
                            })) || []
                        },
                        {label: "Top Mappers", values: stats.top_mappers || [], type: 'list', width: 1},

                    ]}/>
                </div>
            );
        }

        const statsToDisplay: StatItem[] = [
            {label: "Top Mods", values: stats.top_mods || [], type: 'chart', width: 1},
            ...(isPlayer(stats) ? [{
                label: "Most Similar Players",
                type: 'similarity' as const,
                width: 1 as const,
                values: stats.closest_neighbours?.map(item => ({
                    label: playerMap[item.label as string]?.name || item.label,
                    id: item.label,
                    count: item.count
                })) || []
            }] : []),
            {label: "Top Mappers", values: stats.top_mappers || [], type: 'list', width: 1},
            ...(isPlayer(stats) ? [{
                label: "Recent Tops",
                type: 'score' as const,
                width: 2 as const,
                values: stats.recent_scores?.map(score => ({
                    count: Math.round(score.pp),
                    label: null,
                    info: {
                        artist: score.artist,
                        title: score.title,
                        date: score.ended_at,
                        score_id: score._id,
                        user_id: score.user_id
                    }
                }))
            }] : []),
            {label: "Top Artists", values: stats.top_artists || [], type: 'list', width: 1},
            {label: "Top Plays By Year Created", values: stats.year_created_histogram || [], type: 'histogram', width: 2},
            {label: "Top Songs", values: stats.top_songs || [], type: 'list', width: 1},
            {label: "Top Plays By BPM", values: stats.bpm_histogram || [], type: 'histogram', width: 3},
            {
                label: "Top Plays By Hour",
                type: 'histogram',
                width: 3,
                values: stats.hour_histogram.map(item => ({
                        label: `${item.label}:00`,
                        count: item.count
                    }))
                    || []
            },
        ];

        return (
            <div className="mx-auto w-full">
                <StatDetails stats={statsToDisplay}/>
            </div>
        );
    }
;