import {ResponsiveScatterPlot} from '@nivo/scatterplot';
import React from "react";
import styles from "./ScatterPlot.module.css"
import type {UserCoordinate} from "../../../types/globalStats.ts";
import type {Player} from "../../../types/player.ts";

interface ScatterPlotProps {
    data: UserCoordinate[];
    playerData: Player[];
    onToggle: (player: Player) => void;
    activePlayer: Player | null;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({data, playerData, onToggle, activePlayer}) => {

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
        <div className={styles.scatterPlotContainer}>
            <ResponsiveScatterPlot
                data={nivoData}
                isInteractive={true}
                theme={{
                    axis: {
                        ticks: {text: {fill: 'var(--text-muted)'}},
                        legend: {text: {fill: 'var(--text-primary)'}}
                    },
                    grid: {
                        line: {stroke: 'var(--bg-tertiary)', strokeWidth: 1}
                    }
                }}
                margin={{top: 40, right: 40, bottom: 40, left: 60}}
                xScale={{type: 'linear', min: 'auto', max: 'auto'}}
                yScale={{type: 'linear', min: 'auto', max: 'auto'}}
                axisBottom={null}
                axisLeft={null}
                nodeSize={10}
                colors={'var(--gold-primary)'}
                blendMode="normal"

                onClick={(node) => {
                    const player = playerData.find(p => p._id === node.data.userId);
                    if (player) {
                        onToggle(player);
                    }
                }}

                tooltip={({node}) => {
                    const player = playerData.find(p => p._id === node.data.userId);
                    if (!player) return null;
                    return (
                        <div className={styles.hoverPopup}>
                            <strong>{player.name}</strong>
                        </div>
                    );
                }}

                nodeComponent={({node}) => {
                    const {x, y, size, color} = node;
                    const isActive = activePlayer?._id === node.data.userId;

                    return (
                        <g
                            transform={`translate(${x},${y})`}
                            style={{pointerEvents: 'none'}}
                        >
                            {isActive && (
                                <circle r={size * 1.3} fill="var(--gold-primary)" opacity={0.2}/>
                            )}
                            <circle
                                r={isActive ? size * 0.6 : size / 2}
                                fill={isActive ? 'var(--gold-primary)' : color}
                                stroke={isActive ? '#ffffff' : 'none'}
                                strokeWidth={isActive ? 1.5 : 0}
                            />
                        </g>
                    );
                }}
            />
        </div>
    );
};

export default ScatterPlot;