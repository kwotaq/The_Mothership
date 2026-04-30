import {ResponsiveScatterPlotCanvas} from '@nivo/scatterplot';
import type {UserCoordinate} from "../../types/userCoordinates.ts";
import type {Player} from "../../types/player.ts";
import {usePlayers} from '../../utility/context/playerContext.tsx';
import {useEffect, useMemo, useRef, useState} from "react";
import {usePlotInteraction} from "../../utility/hooks/usePlotInteraction.ts";

interface ScatterPlotProps {
    data: UserCoordinate[];
    onToggle: (player: Player) => void;
    activePlayer: Player | null;
}

export const ScatterPlot = ({data, onToggle, activePlayer}: ScatterPlotProps) => {
    const {playerMap} = usePlayers()
    const [isMobile, setIsMobile] = useState(false);
    const lastToggledId = useRef<string | null>(null);
    const {chartRef, domain, bind} = usePlotInteraction();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
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
        const updateSize = () => {
            const {clientWidth, clientHeight} = chartRef.current!;
            setChartSize({width: clientWidth, height: clientHeight});
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [chartRef]);

    const activePos = useMemo(() => {
        if (!activePoint || chartSize.width === 0) return null;
        const margin = isMobile ? 20 : 40;
        const width = chartSize.width - margin * 2;
        const height = chartSize.height - margin * 2;
        const px = margin + ((activePoint.x - domain.x[0]) / (domain.x[1] - domain.x[0])) * width;
        const py = margin + ((1 - (activePoint.y - domain.y[0]) / (domain.y[1] - domain.y[0])) * height);
        return {px, py};
    }, [activePoint, domain, chartSize, isMobile]);

    return (
        <section className="mx-auto w-full">
            <div
                className="w-full h-[350px] sm:h-[400px] md:h-[500px] bg-bg-secondary border border-alien-primary overflow-hidden relative"
                ref={chartRef}
                style={{touchAction: 'none'}}
                {...bind()}
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
                    margin={isMobile ?
                        {top: 20, right: 20, bottom: 20, left: 20} :
                        {top: 40, right: 40, bottom: 40, left: 40}
                    }
                    xScale={{type: "linear", min: domain.x[0], max: domain.x[1], nice: false}}
                    yScale={{type: "linear", min: domain.y[0], max: domain.y[1], nice: false}}
                    axisBottom={null}
                    axisLeft={null}
                    nodeSize={isMobile ? 9 : 12}

                    colors={'rgba(0, 255, 102, 0.2)'}

                    onClick={(node) => {
                        const player = playerMap[node.data.userId]
                        if (player) onToggle(player);
                        lastToggledId.current = activePlayer?._id === player._id ? null : player._id;
                    }}

                    tooltip={({node}) => {
                        if (isMobile && lastToggledId.current !== node.data.userId) return <></>;
                        const player = playerMap[node.data.userId];
                        if (!player) return <div><strong className="text-text-primary">Player name not found</strong>
                        </div>;
                        return (
                            <div>
                                <div
                                    className="bg-bg-primary p-[6px] sm:p-[9px] border border-alien-primary rounded text-text-primary whitespace-nowrap text-xs sm:text-sm">
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
                        <div
                            className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} rounded-full border-4 border-alien-primary animate-ping opacity-60`}/>
                        <div
                            className={`absolute inset-0 rounded-full bg-alien-primary opacity-80 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}
                            style={{filter: 'drop-shadow(0 0 9px var(--alien-primary))'}}/>
                    </div>
                )}
            </div>
        </section>
    );
};