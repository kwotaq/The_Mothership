import {ResponsiveScatterPlot} from '@nivo/scatterplot';
import styles from "./ScatterPlot.module.css";
import type {UserCoordinate} from "../../../types/userCoordinates.ts";
import type {Player} from "../../../types/player.ts";
import {SectionHeader} from "../../../Utility/SectionHeader/SectionHeader.tsx";
import { usePlayers } from '../../../Utility/PlayerContext.tsx';

interface ScatterPlotProps {
    data: UserCoordinate[];
    onToggle: (player: Player) => void;
    activePlayer: Player | null;
}

export const ScatterPlot = ({data, onToggle, activePlayer}: ScatterPlotProps) => {
    const { playerMap } = usePlayers()

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
        <section className={styles.scatterPlotContainer}>
            <SectionHeader title='Player Similarity Map' />
            <div className={styles.chartArea}>
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
                        if (!player) return <div><strong style={{color: 'var(--alien-primary)'}}>Player name not found</strong></div>;
                        return (
                            <div className={styles.hoverPopup}>
                                <strong style={{color: 'var(--alien-primary)'}}>{player.name}</strong>
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
                                        <circle cx="0" cy="0" r={size} className={styles.glowLayer}/>
                                        <circle cx="0" cy="0" r={size / 2} className={styles.pulsingCircle}/>
                                        <circle
                                            cx="0" cy="0" r={size / 2}
                                            className={styles.pulsingCircle}
                                            style={{animationDelay: '1s'}}
                                        />
                                    </>
                                )}

                                {/* The Core Node */}
                                <circle
                                    cx="0" cy="0"
                                    /* Logic: Active is larger (original 'size'), others are small (size / 2) */
                                    r={isActive ? size * 0.7 : size / 2}
                                    fill={isActive ? 'var(--alien-primary)' : 'rgba(0, 255, 102, 0.15)'}
                                    stroke="var(--alien-primary)"
                                    strokeWidth={isActive ? 2 : 0.5}
                                    style={{
                                        cursor: 'pointer',
                                        filter: isActive ? 'drop-shadow(0 0 8px var(--alien-primary))' : 'none',
                                        transition: 'all 0.2s ease'
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