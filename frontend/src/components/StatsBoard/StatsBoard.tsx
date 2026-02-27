import styles from "./StatsBoard.module.css"
import type {GlobalStats} from "../../types/globalStats.ts";
import {type StatItem} from "./StatDetails/StatDetails.tsx";
import {StatDetails} from "./StatDetails/StatDetails.tsx";
import {SectionHeader} from "../../Utility/SectionHeader/SectionHeader.tsx";

export const StatsBoard = ({data: stats}: { data: GlobalStats }) => {
    const statsToDisplay: StatItem[] = [
        {label: "Top Artists", values: stats.top_artists, type: 'list'},
        {label: "Top Songs", values: stats.top_songs, type: 'list'},
        {label: "Top Mods", values: stats.top_mods, type: 'chart'},
        {label: "Top Plays By Hour", values: stats.hour_histogram, type: 'histogram'}
    ];

    return (
        <div className={styles.statsContainer}>
            <SectionHeader title='Player Statistics'/>
            <div>
                <StatDetails stats={statsToDisplay}/>
            </div>
        </div>
    )
};