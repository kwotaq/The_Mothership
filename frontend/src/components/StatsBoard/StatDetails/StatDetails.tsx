import {HourHistogram} from "../../Graphs/HourHistogram.tsx";
import styles from "./StatDetails.module.css";
import type {CountedItem} from "../../../types/globalStats.ts";
import {PieChart} from "../../Graphs/PieChart.tsx";

export interface StatItem {
    label: string;
    values: CountedItem[] | number[];
    type: "list" | "histogram" | "chart";
}

export const StatDetails = ({stats}: {stats: StatItem[]}) => {

    const renderContent = (stat: StatItem) => {
        switch (stat.type) {
            case "histogram":
                return (
                    <HourHistogram
                        data={(stat.values as number[]).map((count, hr) => ({
                            hour: `${hr}:00`,
                            count: count
                        }))}
                    />
                );

            case "chart":
                return (
                    <PieChart
                        data={(stat.values as CountedItem[]).map(v => ({
                            id: v.label,
                            value: v.count
                        }))}
                    />
                );

            case "list":
            default:
                return (
                    <div className={styles.statContent}>
                        {(stat.values as CountedItem[]).map((val, i) => (
                            <div key={i} className={styles.statRow}>
                                <span className="text-gold">{i + 1}</span>
                                <p>{val.label}</p>
                                <span className={styles.countBadge}>{val.count}</span>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className={styles.detailsGrid}>
            {stats.map((stat, index) => {
                const isWide = stat.type == "histogram";
                return (
                    <div
                        key={index}
                        className={`${styles.statSection} ${isWide ? styles.wideSection : ''}`}
                    >
                        <h3 className="text-gold">{stat.label}</h3>
                        {renderContent(stat)}
                    </div>
                );
            })}
        </div>
    );
};