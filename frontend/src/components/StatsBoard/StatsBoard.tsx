import React from "react";
import styles from "./StatsBoard.module.css"
import type {GlobalStats} from "../../types/globalStats.ts";
import ScatterPlot from "../Graphs/ScatterPlot/ScatterPlot.tsx";
import type {Player} from "../../types/player.ts";
import StatDetails, {type StatItem} from "./StatDetails/StatDetails.tsx";

interface StatsProps {
    data: GlobalStats;
    playerData: Player[];
    loading: boolean;
    error: string | null;
    onToggle: (player: Player) => void;
    activePlayer: Player | null;
}

const StatsBoard: React.FC<StatsProps> = ({data, playerData, loading, error, activePlayer, onToggle}) => {

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
        const statsToDisplay: StatItem[] = [
            {label: "Top Artists", values: data.top_artists, type: 'list'},
            {label: "Top Songs", values: data.top_songs, type: 'list'},
            {label: "Top Mods", values: data.top_mods, type: 'list'},
            {label: "Top Plays By Hour", values: data.hour_histogram, type: 'histogram'}
        ];

        return (
            <div>
                <ScatterPlot data={data.similarity_coordinates} playerData={playerData} onToggle={onToggle} activePlayer={activePlayer}/>
                <StatDetails stats={statsToDisplay}/>
            </div>
        );
    }

    return (
        <div className={styles.statsContainer}>
            <div className={styles.statsHeader}>
                <h2>Player Statistics</h2>
            </div>
            {renderContent()}
        </div>
    )
};

export default StatsBoard;