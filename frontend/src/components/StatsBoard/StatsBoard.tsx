import styles from "./StatsBoard.module.css"
import type {GlobalStats} from "../../types/globalStats.ts";
import StatDetails, {type StatItem} from "./StatDetails/StatDetails.tsx";

const StatsBoard = ({data: stats}: { data: GlobalStats }) => {
    const statsToDisplay: StatItem[] = [
        {label: "Top Artists", values: stats.top_artists, type: 'list'},
        {label: "Top Songs", values: stats.top_songs, type: 'list'},
        {label: "Top Mods", values: stats.top_mods, type: 'list'},
        {label: "Top Plays By Hour", values: stats.hour_histogram, type: 'histogram'}
    ];

    return (
        <div className={styles.statsContainer}>
            <div className={styles.statsHeader}>
                <h2>Player Statistics</h2>
            </div>
            <div>
                <StatDetails stats={statsToDisplay}/>
            </div>
        </div>
    )
};

export default StatsBoard;