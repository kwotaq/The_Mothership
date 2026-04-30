import {ResponsiveLine} from '@nivo/line';
import {usePlayers} from "../../../utility/context/playerContext.tsx";
import type {LiveScoreSeries} from "../../../utility/context/liveStreamContext.tsx";
import {useEffect, useMemo, useState} from "react";
import {VisiblePlayerList} from "./VisiblePlayerList.tsx";
import {COLOR_PALETTE} from "./colorPalette.ts";
import {useFeedInteraction} from "../../../utility/hooks/useFeedInteraction.ts";

export const LiveScoreGraph = ({data}: { data: LiveScoreSeries[] }) => {
    const {playerMap} = usePlayers();
    const [isMobile, setIsMobile] = useState(false);
    const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
    const {chartRef, xDomain, bind} = useFeedInteraction();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
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
        <section className="flex flex-col lg:flex-row w-full gap-4 max-h-[600px] lg:max-h-none overflow-hidden">
            <div
                ref={chartRef}
                style={{touchAction: 'none'}}
                className="w-full h-[450px] sm:h-[600px] bg-bg-secondary border border-alien-primary overflow-hidden relative"
                {...bind()}
            >
                <ResponsiveLine
                    data={visiblePoints}
                    margin={{top: isMobile ? 30: 100, right: isMobile ? 30: 70, bottom: isMobile ? 50: 60, left: isMobile ? 35: 70}}
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

                    onClick={(point) => {
                        if ('data' in point) {
                            const scoreId = (point.data as any)._id;
                            window.open(`https://osu.ppy.sh/scores/${scoreId}`, '_blank');
                        }
                    }}

                    layers={['grid', 'axes', 'areas', 'points', 'slices', 'mesh', 'legends']}

                    tooltip={({point}) => {
                        if (activePlayerId !== null && point.seriesId !== activePlayerId || isMobile) return <></>;
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