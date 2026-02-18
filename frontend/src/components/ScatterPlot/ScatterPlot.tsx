import {ResponsiveScatterPlot} from '@nivo/scatterplot';
import React from "react";
import styles from "./ScatterPlot.module.css"
import type {UserCoordinate} from "../../types/globalStats.ts";
import type {Player} from "../../types/player.ts";

interface ScatterPlotProps {
    data: UserCoordinate[];
    playerData: Player[];
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({data, playerData}) => {

    const nivoData = [
        {
            id: "Player Similarity",
            data: data.map((point) => ({
                x: point.x,
                y: point.y,
                userId: point.user_id,
            })),
        },
    ];

    return (
        <div className={styles.scatterPlotContainer}>
            <ResponsiveScatterPlot
                data={nivoData}
                useMesh={false}
                isInteractive={true}
                enableGridX={false}
                enableGridY={false}
                margin={{top: 40, right: 40, bottom: 40, left: 60}}
                xScale={{type: 'linear', min: 'auto', max: 'auto'}}
                yScale={{type: 'linear', min: 'auto', max: 'auto'}}
                axisBottom={null}
                axisLeft={null}
                nodeSize={10}
                colors={{scheme: 'category10'}}
                blendMode="multiply"

                tooltip={({node}) => (
                    <div className={styles.hoverPopup}>
                        <strong>
                            {playerData.find(p => p._id === node.data.userId)?.name || "Unknown User"}
                        </strong>
                    </div>
                )}
            />
        </div>
    );
};

export default ScatterPlot;