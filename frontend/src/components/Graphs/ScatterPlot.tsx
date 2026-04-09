import {ResponsiveScatterPlot} from '@nivo/scatterplot';
import type {UserCoordinate} from "../../types/userCoordinates.ts";
import type {Player} from "../../types/player.ts";
import {usePlayers} from '../../utility/context/playerContext.tsx';
import {useEffect, useMemo, useRef, useState} from "react";

interface ScatterPlotProps {
    data: UserCoordinate[];
    onToggle: (player: Player) => void;
    activePlayer: Player | null;
}

export const ScatterPlot = ({data, onToggle, activePlayer}: ScatterPlotProps) => {
    const {playerMap} = usePlayers()
    const isDragging = useRef(false);
    const hasDragged = useRef(false);
    const dragStart = useRef<[number, number] | null>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const [domain, setDomain] = useState<{ x: [number, number], y: [number, number] }>({
        x: [-60, 60],
        y: [-60, 60]
    });

    useEffect(() => {
        const el = chartRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 1.2 : 0.8;
            setDomain(({x, y}) => {
                const xCenter = (x[0] + x[1]) / 2;
                const yCenter = (y[0] + y[1]) / 2;
                const xRange = (x[1] - x[0]) * zoomFactor;
                const yRange = (y[1] - y[0]) * zoomFactor;
                return {
                    x: [xCenter - xRange / 2, xCenter + xRange / 2],
                    y: [yCenter - yRange / 2, yCenter + yRange / 2]
                };
            });
        };
        el.addEventListener('wheel', onWheel, {passive: false});
        return () => el.removeEventListener('wheel', onWheel);
    }, []);


    const nivoData = useMemo(() => [{
        id: "Player Similarity",
        data: data.map((point) => ({
            x: point.x,
            y: point.y,
            userId: point.user_id,
            isActive: activePlayer?._id === point.user_id
        })),
    }], [data, activePlayer]);

    return (
        <section className="mx-auto w-full">
            <div
                ref={chartRef}
                style={{touchAction: 'none'}}
                onMouseDown={(e) => {
                    isDragging.current = true;
                    hasDragged.current = false;
                    dragStart.current = [e.clientX, e.clientY];
                }}

                onMouseMove={(e) => {
                    if (!isDragging.current || dragStart.current === null) return;
                    hasDragged.current = true;
                    const dx = e.clientX - dragStart.current[0];
                    const dy = e.clientY - dragStart.current[1];
                    dragStart.current = [e.clientX, e.clientY];

                    setDomain(({x, y}) => {
                        const xRange = x[1] - x[0];
                        const yRange = y[1] - y[0];
                        const xShift = (dx / chartRef.current!.clientWidth) * xRange * -1;
                        const yShift = (dy / chartRef.current!.clientHeight) * yRange;
                        return {
                            x: [x[0] + xShift, x[1] + xShift],
                            y: [y[0] + yShift, y[1] + yShift]
                        };
                    });
                }}

                onMouseUp={() => {
                    isDragging.current = false;
                }}
                onMouseLeave={() => {
                    isDragging.current = false;
                }}
                className="w-full h-[500px] bg-bg-secondary border border-alien-primary overflow-hidden relative">
                <ResponsiveScatterPlot
                    data={nivoData}
                    isInteractive={true}
                    animate={false}
                    theme={{
                        axis: {
                            legend: {text: {fill: 'var(--text-primary)'}}
                        },
                        grid: {
                            line: {stroke: 'var(--bg-tertiary)', strokeWidth: 1}
                        }
                    }}
                    margin={{top: 40, right: 40, bottom: 40, left: 40}}
                    xScale={{type: "linear", min: domain.x[0], max: domain.x[1], nice: false}}
                    yScale={{type: "linear", min: domain.y[0], max: domain.y[1], nice: false}}
                    axisBottom={null}
                    axisLeft={null}
                    nodeSize={10}
                    colors={'var(--alien-primary)'}

                    onClick={(node) => {
                        if (hasDragged.current) return;
                        const player = playerMap[node.data.userId]
                        if (player) onToggle(player);
                    }}

                    tooltip={({node}) => {
                        const player = playerMap[node.data.userId]
                        if (!player) return <div><strong className="text-text-primary">Player name not found</strong>
                        </div>;
                        return (
                            <div>
                                <div
                                    className="bg-bg-primary p-[9px] border border-alien-primary rounded text-text-primary whitespace-nowrap">
                                    <strong className="text-text-primary">{player.name}</strong>
                                </div>
                            </div>
                        );
                    }}

                    nodeComponent={({node}) => {
                        const {x, y, size} = node;
                        const isActive = node.data.isActive;

                        return (
                            <g transform={`translate(${x},${y})`}>
                                {isActive && (
                                    <>
                                        <circle
                                            cx="0" cy="0" r={size}
                                            className="fill-alien-primary blur-[6px] opacity-20 pointer-events-none origin-center [transform-box:fill-box]"
                                        />
                                        <style>
                                            {`@keyframes steady-pulse {
                                            0% { transform: scale(1); opacity: 0.6; }
                                            100% { transform: scale(3); opacity: 0; }}`}
                                        </style>

                                        <circle
                                            cx="0" cy="0" r={size / 2}
                                            className="fill-none stroke-alien-primary stroke-[2px]
                                            pointer-events-none origin-center [transform-box:fill-box]
                                            [animation:steady-pulse_2s_ease-out_infinite]"
                                        />
                                    </>
                                )}

                                <circle
                                    cx="0" cy="0"
                                    r={isActive ? size * 0.7 : size / 2}
                                    fill={isActive ? 'var(--alien-primary)' : 'rgba(0, 255, 102, 0.15)'}
                                    stroke="var(--alien-primary)"
                                    strokeWidth={isActive ? 2 : 0.5}
                                    className="cursor-pointer transition-all duration-200"
                                    style={{
                                        filter: isActive ? 'drop-shadow(0 0 8px var(--alien-primary))' : 'none',
                                    }}
                                />
                            </g>
                        );
                    }}
                />
            </div>
        </section>
    );
};