import {ResponsiveLine} from '@nivo/line';
import {usePlayers} from "../../utility/context/playerContext.tsx";
import type {LiveScoreSeries} from "../../utility/context/liveStreamContext.tsx";
import {useEffect, useMemo, useRef, useState} from "react";

const COLOR_PALETTE = [
    '#00f2ff', '#ff0055', '#00ff66', '#bc13fe',
    '#fbbf24', '#3b82f6', '#f97316', '#a855f7',
    '#2dd4bf', '#ef4444', '#84cc16', '#6366f1'
];

export const LiveScoreGraph = ({data}: { data: LiveScoreSeries[] }) => {
    const {playerMap} = usePlayers();
    const [isMobile, setIsMobile] = useState(false);
    const [hoveredPlayerId, setHoveredPlayerId] = useState<string | null>(null);
    const isDragging = useRef(false);
    const dragStart = useRef<number | null>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const [xDomain, setXDomain] = useState<[Date, Date]>(() => {
        const now = new Date();
        const defaultTimeLimit = new Date(now.getTime() - 6 * 60 * 60 * 1000); // 6 hours
        return [defaultTimeLimit, now];
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const el = chartRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 1.2 : 0.8;
            setXDomain(([min, max]) => {
                const center = new Date((min.getTime() + max.getTime()) / 2);
                const range = max.getTime() - min.getTime();
                const newRange = range * zoomFactor;
                return [
                    new Date(center.getTime() - newRange / 2),
                    new Date(center.getTime() + newRange / 2)
                ];
            });
        };
        el.addEventListener('wheel', onWheel, {passive: false});
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    const transformedData = useMemo(() => {
        if (!playerMap || Object.keys(playerMap).length === 0) return [];
        return data.map((series) => ({
            ...series,
            data: series.data.map(point => ({
                ...point,
                x: new Date(point.x)
            }))
        }));
    }, [data, playerMap]);

    const colorIndexMap = useMemo(() => {
        return Object.fromEntries(data.map((series, i) => [series.id, i]));
    }, [data]);

    const visiblePoints = useMemo(() => {
        const [min, max] = xDomain;
        return transformedData.map(series => ({
            ...series,
            data: series.data.filter(point => point.x >= min && point.x <= max)
        }));
    }, [transformedData, xDomain]);

    if (transformedData.length === 0) return null;

    return (
        <section className="flex flex-col lg:flex-row w-full gap-4">
            <div
                ref={chartRef}
                style={{touchAction: 'none'}}
                className="flex-1 h-[400px] sm:h-[500px] bg-bg-secondary border border-alien-primary overflow-hidden relative"
                onMouseDown={(e) => {
                    isDragging.current = true;
                    dragStart.current = e.clientX;
                }}
                onMouseMove={(e) => {
                    if (!isDragging.current || dragStart.current === null) return;
                    const dx = e.clientX - dragStart.current;
                    dragStart.current = e.clientX;
                    setXDomain(([min, max]) => {
                        const range = max.getTime() - min.getTime();
                        const shift = (dx / chartRef.current!.clientWidth) * range * -1;
                        return [new Date(min.getTime() + shift), new Date(max.getTime() + shift)];
                    });
                }}
                onMouseUp={() => {
                    isDragging.current = false;
                }}
                onMouseLeave={() => {
                    isDragging.current = false;
                }}
            >
                <ResponsiveLine
                    data={visiblePoints}
                    margin={{top: 60, right: 30, bottom: 60, left: 60}}
                    xScale={{
                        type: 'time',
                        format: 'native',
                        useUTC: false,
                        precision: 'second',
                        min: xDomain[0],
                        max: xDomain[1]
                    }}
                    yScale={{type: 'linear', min: 0, max: 'auto'}}
                    axisBottom={{
                        format: '%H:%M',
                        tickValues: isMobile ? 3 : 5,
                        tickPadding: 15,
                        tickRotation: isMobile ? -30 : 0,
                    }}
                    axisLeft={{
                        legend: isMobile ? '' : 'PP',
                        legendOffset: -45,
                        legendPosition: 'middle',
                        tickSize: isMobile ? 0 : 5,
                        tickPadding: 5,
                    }}
                    colors={COLOR_PALETTE}
                    pointSize={isMobile ? 5 : 8}
                    pointColor={({point}) => {
                        const isHovered = hoveredPlayerId === null || hoveredPlayerId === point.seriesId;
                        const color = COLOR_PALETTE[colorIndexMap[point.seriesId] % COLOR_PALETTE.length];
                        return isHovered ? color : `${color}26`;
                    }}
                    pointBorderWidth={2}
                    pointBorderColor="var(--bg-secondary)"
                    enablePointLabel={false}
                    useMesh={true}
                    lineWidth={0}
                    animate={false}

                    layers={['grid', 'axes', 'areas', 'points', 'slices', 'mesh', 'legends']}

                    tooltip={({point}) => {
                        const player = playerMap[point.seriesId];

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
                                    {new Date(point.data.x).toLocaleString([], {
                                        day: '2-digit',
                                        month: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    })}
                                </span>
                                <strong className="text-sm text-text-primary border-b border-alien-primary/20 pb-1">
                                    {player.name}
                                </strong>
                                <span
                                    className="font-mono text-alien-primary font-bold text-xs">{point.data.y === 0 ? 'Unranked' : `${point.data.y}pp`}</span>
                                <div
                                    className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-bg-primary border-r border-b border-alien-primary rotate-45"/>
                            </div>
                        );
                    }}

                    theme={{
                        axis: {
                            domain: {line: {stroke: 'var(--alien-primary)', strokeWidth: 1}},
                            ticks: {text: {fill: 'var(--text-secondary)', fontSize: isMobile ? 9 : 11}},
                            legend: {
                                text: {
                                    fill: 'var(--text-primary)',
                                    fontWeight: 'bold',
                                    fontSize: isMobile ? 12 : 14
                                }
                            }
                        },
                        grid: {
                            line: {stroke: 'rgba(255, 255, 255, 0.05)', strokeWidth: 1}
                        },
                    }}
                />
            </div>

            <div
                className="w-full lg:w-64 h-auto max-h-[200px] lg:h-[500px] lg:max-h-none bg-bg-primary border border-alien-primary p-3 sm:p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar shadow-lg">
                <div className="flex items-center justify-between border-b border-alien-primary pb-2 mb-1 sm:mb-2">
                    <span className="text-xs font-bold uppercase text-text-primary tracking-widest">
                        Active Players
                    </span>
                </div>

                <div className="flex flex-row lg:flex-col flex-wrap lg:flex-nowrap gap-2">
                    {visiblePoints.filter(series => series.data.length > 0).map((series) => {
                        const player = playerMap[series.id]
                        const playerName = player.name || `User ${series.id}`;
                        const color = COLOR_PALETTE[colorIndexMap[series.id] % COLOR_PALETTE.length];
                        const isHovered = hoveredPlayerId === series.id;

                        return (
                            <div
                                key={series.id}
                                onMouseEnter={() => setHoveredPlayerId(series.id)}
                                onMouseLeave={() => setHoveredPlayerId(null)}
                                className={`flex items-center gap-2 p-1.5 sm:p-2 rounded transition-all group cursor-pointer flex-1 min-w-[120px] lg:min-w-0
                                ${isHovered ? 'bg-white/10' : 'hover:bg-white/5'}
                                ${hoveredPlayerId && !isHovered ? 'opacity-40' : 'opacity-100'}`}
                            >
                                <span
                                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                                    style={{
                                        backgroundColor: color,
                                        boxShadow: `0 0 10px ${color}66`
                                    }}
                                />
                                <span
                                    className={`text-xs sm:text-sm truncate font-medium transition-colors ${
                                        isHovered ? 'text-white' : 'text-text-primary'
                                    }`} title={playerName}>
                                    <a href={`https://osu.ppy.sh/users/${player._id}`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-text-primary hover:underline"
                                       onClick={(e) => e.stopPropagation()}
                                    >
                                        {player.name}
                                    </a>
                                </span>
                            </div>
                        );
                    })}

                    {visiblePoints.filter(s => s.data.length > 0).length === 0 && (
                        <div className="text-text-tertiary text-xs italic py-4 text-center">
                            Waiting for scores...
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};