import {ResponsiveScatterPlotCanvas} from '@nivo/scatterplot';
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
    const [domain, setDomain] = useState({
        x: [-11, 11] as [number, number],
        y: [-11, 11] as [number, number]
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

    const activePoint = useMemo(() =>
            nivoData[0].data.find(p => p.isActive)
        , [nivoData]);

    const [chartSize, setChartSize] = useState({width: 0, height: 0});

    useEffect(() => {
        if (!chartRef.current) return;
        const {clientWidth, clientHeight} = chartRef.current;
        setChartSize({width: clientWidth, height: clientHeight});
    }, []);

    const activePos = useMemo(() => {
        if (!activePoint || chartSize.width === 0) return null;
        const margin = 40;
        const width = chartSize.width - margin * 2;
        const height = chartSize.height - margin * 2;
        const px = margin + ((activePoint.x - domain.x[0]) / (domain.x[1] - domain.x[0])) * width;
        const py = margin + ((1 - (activePoint.y - domain.y[0]) / (domain.y[1] - domain.y[0])) * height);
        return {px, py};
    }, [activePoint, domain, chartSize]);

    return (
        <section className="mx-auto w-full">
            <div
                className="w-full h-[500px] bg-bg-secondary border border-alien-primary overflow-hidden relative"
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
            >
                <ResponsiveScatterPlotCanvas
                    key={data?.length}
                    data={nivoData}
                    isInteractive={true}
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
                    nodeSize={12}

                    colors={'rgba(0, 255, 102, 0.2)'}

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
                />
                {activePos && (
                    <div
                        className="absolute pointer-events-none"
                        style={{left: activePos.px, top: activePos.py, transform: 'translate(-50%, -50%)'}}
                    >
                        <div className="w-5 h-5 rounded-full border-4 border-alien-primary animate-ping opacity-60"/>
                        <div className="absolute inset-0 rounded-full bg-alien-primary opacity-80"
                             style={{filter: 'drop-shadow(0 0 9px var(--alien-primary))'}}/>
                    </div>
                )}
            </div>
        </section>
    );
};