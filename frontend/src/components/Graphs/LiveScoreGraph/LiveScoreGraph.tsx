import {ResponsiveLine} from '@nivo/line';
import {usePlayers} from "../../../utility/context/playerContext.tsx";
import type {LiveScoreSeries} from "../../../utility/context/liveStreamContext.tsx";
import {useEffect, useMemo, useRef, useState} from "react";
import {VisiblePlayerList} from "./VisiblePlayerList.tsx";
import {COLOR_PALETTE} from "./colorPalette.ts";

export const LiveScoreGraph = ({data}: { data: LiveScoreSeries[] }) => {
    const {playerMap} = usePlayers();
    const [isMobile, setIsMobile] = useState(false);
    const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
    const isDragging = useRef(false);
    const hasDragged = useRef(false);
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
                className="flex-1 h-[450px] sm:h-[600px] bg-bg-secondary border border-alien-primary overflow-hidden relative"
                onMouseDown={(e) => {
                    isDragging.current = true;
                    hasDragged.current = false;
                    dragStart.current = e.clientX;
                }}
                onMouseMove={(e) => {
                    if (!isDragging.current || dragStart.current === null) return;
                    hasDragged.current = true;
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
                    margin={{top: 100, right: 70, bottom: 60, left: 70}}
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
                        const isHovered = activePlayerId === null || activePlayerId === point.seriesId;
                        const color = COLOR_PALETTE[colorIndexMap[point.seriesId] % COLOR_PALETTE.length];
                        return isHovered ? color : `${color}26`;
                    }}
                    pointBorderWidth={2}
                    pointBorderColor="var(--bg-secondary)"
                    enablePointLabel={false}
                    useMesh={true}
                    lineWidth={0}
                    animate={false}

                    onClick={(point) => !hasDragged.current && window.open(`https://osu.ppy.sh/scores/${point.data._id}`, '_blank')}

                    layers={['grid', 'axes', 'areas', 'points', 'slices', 'mesh', 'legends']}

                    tooltip={({point}) => {
                        if (activePlayerId !== null && point.seriesId !== activePlayerId) return <></>;
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
            <VisiblePlayerList
                visiblePoints={visiblePoints}
                activePlayerId={activePlayerId}
                setActivePlayerId={setActivePlayerId}
            />
        </section>
    );
};