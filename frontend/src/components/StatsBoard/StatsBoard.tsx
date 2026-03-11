import type {GlobalStats} from "../../types/globalStats.ts";
import {type StatItem} from "./StatDetails.tsx";
import {StatDetails} from "./StatDetails.tsx";
import {SectionHeader} from "../../Utility/SectionHeader.tsx";

export const StatsBoard = ({data: stats}: { data: GlobalStats }) => {
    const statsToDisplay: StatItem[] = [
        {label: "Top Artists", values: stats.top_artists, type: 'list'},
        {label: "Top Songs", values: stats.top_songs, type: 'list'},
        {label: "Top Mods", values: stats.top_mods, type: 'chart'},
        {label: "Top Plays By Hour", values: stats.hour_histogram, type: 'histogram'}
    ];

    return (
        <div className="p-8 max-w-[1200px] mx-auto w-full">
            <SectionHeader title='Player Statistics'/>
            <div>
                <StatDetails stats={statsToDisplay}/>
            </div>
        </div>
    )
};