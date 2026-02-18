import React from "react";
import styles from "./StatsBoard.module.css"
import type {GlobalStats} from "../../types/globalStats.ts";
import ScatterPlot from "../ScatterPlot/ScatterPlot.tsx";
import type {Player} from "../../types/player.ts";

interface StatsProps {
    data: GlobalStats;
    playerData: Player[];
    loading: boolean;
    error: string | null;
}

const StatsBoard: React.FC<StatsProps> = ({data, playerData, loading, error}) => {

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p className="text-gold">Loading stats...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-state">
                    <h3 className="text-gold">Failed to Load Stats</h3>
                    <p className="text-muted">{error}</p>
                </div>
            );
        }

        if (!data) {
            return (
                <div className="empty-state">
                    <h3>No stats Found</h3>
                    <p className="text-muted">There are no stats to display at the moment.</p>
                </div>
            );
        }
        return (
            <ScatterPlot data={data.similarity_coordinates} playerData={playerData}/>
        );
    }

    return (
        <div>
            <div className={styles.statsHeader}>
                <h2>Player Statistics</h2>
            </div>
            {renderContent()}
        </div>
    )
};

export default StatsBoard;