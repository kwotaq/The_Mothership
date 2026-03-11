import {ResponsiveScatterPlot} from '@nivo/scatterplot';
import type {UserCoordinate} from "../../types/userCoordinates.ts";
import type {Player} from "../../types/player.ts";
import {SectionHeader} from "../../Utility/SectionHeader.tsx";
import {usePlayers} from '../../Utility/PlayerContext.tsx';

interface ScatterPlotProps {
    data: UserCoordinate[];
    onToggle: (player: Player) => void;
    activePlayer: Player | null;
}

export const ScatterPlot = ({data, onToggle, activePlayer}: ScatterPlotProps) => {
    const {playerMap} = usePlayers()

    const nivoData = [
        {
            id: "Player Similarity",
            data: data.map((point) => ({
                x: point.x,
                y: point.y,
                userId: point.user_id,
                isActive: activePlayer?._id === point.user_id
            })),
        },
    ];

    return (
        <section className="mx-auto w-full">
            <SectionHeader title='Player Similarity Map'/>
            <div className="w-full h-[500px] bg-bg-secondary border border-alien-primary overflow-hidden relative">
                <ResponsiveScatterPlot
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
                    xScale={{type: 'linear', min: 'auto', max: 'auto'}}
                    yScale={{type: 'linear', min: 'auto', max: 'auto'}}
                    axisBottom={null}
                    axisLeft={null}
                    nodeSize={10}
                    colors={'var(--alien-primary)'}

                    onClick={(node) => {
                        const player = playerMap[node.data.userId]
                        if (player) onToggle(player);
                    }}

                    tooltip={({node}) => {
                        const player = playerMap[node.data.userId]
                        if (!player) return <div><strong className="text-text-primary">Player name not found</strong></div>;
                        return (
                            <div
                                className="bg-bg-primary p-[9px] border border-alien-primary rounded text-text-primary whitespace-nowrap">
                                <strong className="text-text-primary">{player.name}</strong>
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
                                        <circle
                                            cx="0" cy="0" r={size / 2}
                                            className="fill-none stroke-alien-primary stroke-[2px]
                                            pointer-events-none origin-center [transform-box:fill-box]
                                            [animation:steady-pulse_2s_ease-out_infinite] [animation-delay:1s]"
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