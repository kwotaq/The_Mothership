import {ResponsiveLine} from '@nivo/line';
import {usePlayers} from "../../Utility/context/PlayerContext.tsx";
import type {LiveScoreSeries} from "../../Utility/context/LiveStreamContext.tsx";
import {useMemo, useState} from "react";

interface LiveScoreGraphProps {
    data: LiveScoreSeries[];
}

const COLOR_PALETTE = [
    '#00f2ff', '#ff0055', '#00ff66', '#bc13fe',
    '#fbbf24', '#3b82f6', '#f97316', '#a855f7',
    '#2dd4bf', '#ef4444', '#84cc16', '#6366f1'
];

export const LiveScoreGraph = ({data}: LiveScoreGraphProps) => {
    const {playerMap} = usePlayers();
    const [hoveredPlayerId, setHoveredPlayerId] = useState<string | null>(null);

    const transformedData = useMemo(() => {
        if (!playerMap || Object.keys(playerMap).length === 0) return [];
        return data.map((series) => ({
            ...series,
            id: playerMap[series.id]?.name || `User ${series.id}`,
            data: series.data.map(point => ({
                ...point,
                x: new Date(point.x)
            }))
        }));
    }, [data, playerMap]);

    if (transformedData.length === 0) return null;

    return (
        <section className="flex w-full gap-4">
            <div className="flex-1 h-[500px] bg-bg-secondary border border-alien-primary overflow-hidden relative">
                <ResponsiveLine
                    data={transformedData}
                    margin={{top: 80, right: 40, bottom: 60, left: 80}}
                    xScale={{type: 'time', format: 'native', useUTC: false, precision: 'second'}}
                    yScale={{type: 'linear', min: 0, max: 'auto'}}
                    axisBottom={{
                        format: '%H:%M',
                        tickValues: 5,
                        legend: 'Time',
                        legendOffset: 34,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        legend: 'PP',
                        legendOffset: -55,
                        legendPosition: 'middle'
                    }}
                    colors={COLOR_PALETTE}
                    pointSize={8}
                    pointColor={(point) => {
                        const seriesIndex = transformedData.findIndex(s => s.id === point.series.id);
                        if (seriesIndex === -1) return '#ffffff';
                        const originalId = data[seriesIndex]?.id;
                        const isHovered = hoveredPlayerId === null || hoveredPlayerId === originalId;
                        const color = COLOR_PALETTE[seriesIndex % COLOR_PALETTE.length];
                        return isHovered ? color : `${color}26`;
                    }}
                    pointBorderWidth={2}
                    pointBorderColor="var(--bg-secondary)"
                    enablePointLabel={false}
                    useMesh={true}
                    lineWidth={0}

                    layers={['grid', 'axes', 'areas', 'points', 'slices', 'mesh', 'legends']}

                    tooltip={({point}) => {
                        const player = playerMap[point.data.score.user_id];

                        if (!player) return (
                            <div
                                className="bg-bg-primary p-[9px] border border-alien-primary rounded text-text-primary">
                                <strong>Player name not found</strong>
                            </div>
                        );

                        return (
                            <div
                                className="bg-bg-primary p-[9px] border border-alien-primary text-text-primary flex flex-col gap-1 min-w-[120px] -mt-2 relative z-50">
                                <span className="text-[10px] font-mono text-text-secondary uppercase tracking-tighter">
                                    {new Date(point.data.x).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </span>
                                <strong className="text-sm text-text-primary border-b border-alien-primary/20 pb-1">
                                    {player.name}
                                </strong>
                                <span className="font-mono text-alien-primary font-bold text-xs">{point.data.y === 0 ? 'Unranked' : `${point.data.y}pp`}</span>
                                <div
                                    className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-bg-primary border-r border-b border-alien-primary rotate-45"/>
                            </div>
                        );
                    }}

                    theme={{
                        axis: {
                            domain: {line: {stroke: 'var(--alien-primary)', strokeWidth: 1}},
                            ticks: {text: {fill: 'var(--text-secondary)', fontSize: 11}},
                            legend: {text: {fill: 'var(--text-primary)', fontWeight: 'bold', fontSize: 14}}
                        },
                        grid: {
                            line: {stroke: 'rgba(255, 255, 255, 0.05)', strokeWidth: 1}
                        },
                    }}
                />
            </div>

            <div
                className="w-64 h-[500px] bg-bg-primary border border-alien-primary p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar shadow-lg">
                <div className="flex items-center justify-between border-b border-alien-primary pb-2 mb-2">
                    <span className="text-xs font-bold uppercase text-text-primary tracking-widest">
                        Active Players
                    </span>
                </div>

                <div className="flex flex-col">
                    {data.map((series, i) => {
                        const playerName = playerMap[series.id]?.name || `User ${series.id}`;
                        const color = COLOR_PALETTE[i % COLOR_PALETTE.length];
                        const isHovered = hoveredPlayerId === series.id;

                        return (
                            <div
                                key={series.id}
                                onMouseEnter={() => setHoveredPlayerId(series.id)}
                                onMouseLeave={() => setHoveredPlayerId(null)}
                                className={`flex items-center gap-3 p-2 rounded transition-all group cursor-pointer
                                ${isHovered ? 'bg-white/10' : 'hover:bg-white/5'}
                                ${hoveredPlayerId && !isHovered ? 'opacity-40' : 'opacity-100'}`}
                            >
                                <span
                                    className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                                    style={{
                                        backgroundColor: color,
                                        boxShadow: `0 0 10px ${color}66`
                                    }}
                                />
                                <span
                                    className={`text-sm truncate font-medium transition-colors ${
                                        isHovered ? 'text-white' : 'text-text-primary'
                                    }`} title={playerName}>
                                    {playerName}
                                </span>
                            </div>
                        );
                    })}

                    {data.length === 0 && (
                        <div className="text-text-tertiary text-xs italic py-4 text-center">
                            Waiting for scores...
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};