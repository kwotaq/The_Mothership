import React from "react";
import HourHistogram from "../../Graphs/HourHistogram/HourHistogram.tsx"
import styles from "./StatDetails.module.css"
import type {CountedItem} from "../../../types/globalStats.ts";

export interface StatItem {
    label: string;
    values: CountedItem[] | number[];
    type: string;
}

interface StatDetailsProps {
    stats: StatItem[];
}

const StatDetails: React.FC<StatDetailsProps> = ({ stats }) => {
    return (
        <div className={styles.detailsGrid}>
            {stats.map((stat, index) => {
                const isWide = stat.type != "list";

                return (
                    <div
                        key={index}
                        className={`${styles.statSection} ${isWide ? styles.wideSection : ''}`}
                    >
                        <h3 className="text-gold">{stat.label}</h3>

                        {isWide ? (
                            <HourHistogram
                                data={stat.values.map((count, hr) => ({
                                    hour: `${hr}:00`,
                                    count: count as number
                                }))}
                            />
                        ) : (
                            <div className={styles.statContent}>
                                {stat.values.map((val: any, i) => (
                                    <div key={i} className={styles.statRow}>
                                        <span className="text-gold">{i + 1}</span>
                                        <p>{val.name || val.label}</p>
                                        <span className={styles.countBadge}>{val.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StatDetails;