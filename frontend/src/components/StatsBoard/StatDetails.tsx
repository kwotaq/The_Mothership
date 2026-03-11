import {HourHistogram} from "../Graphs/HourHistogram.tsx";
import {PieChart} from "../Graphs/PieChart.tsx";
import type {CountedItem} from "../../types/globalStats.ts";

export interface StatItem {
    label: string;
    values: CountedItem[] | number[];
    type: "list" | "histogram" | "chart";
}

export const StatDetails = ({stats}: { stats: StatItem[] }) => {

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
                    <div className="flex flex-col gap-3">
                        {(stat.values as CountedItem[]).map((val, i) => (
                            <div key={i}
                                 className="flex items-center gap-4 text-[1.1rem] text-white border-b border-dashed border-white/5 pb-1">
                                <span className="min-w-[30px] font-mono font-bold text-alien-primary">
                                    {val.count}
                                </span>
                                <p>{val.label}</p>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="grid grid-cols-3 gap-6 mt-8">
            {stats.map((stat, index) => {
                const isWide = stat.type === "histogram";

                return (
                    <div
                        key={index}
                        className={`
                            interactive-panel
                            ${isWide ? 'col-span-3 order-first' : 'col-span-1'}
                            p-6 flex flex-col min-h-0
                        `}
                    >
                        <h3
                            className="
                            mb-4 text-[1.1rem] uppercase tracking-[2px] font-bold text-text-primary pl-[5px] pb-2
                            border-b border-alien-primary/20
                            ">
                            {stat.label}
                        </h3>
                        <div className="flex-1 min-h-0">
                            {renderContent(stat)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};