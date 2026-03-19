import {HourHistogram} from "../graphs/HourHistogram.tsx";
import {PieChart} from "../graphs/PieChart.tsx";
import type {CountedItem} from "../../types/playerMetrics.ts";

export interface StatItem {
    label: string;
    values: CountedItem[] | number[];
    type: "list" | "histogram" | "chart" | "similarity";
    width?: 1 | 2 | 3; // 1 = small, 2 = medium, 3 = full width
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

            case "similarity":
                return (
                    <div className="flex flex-col gap-4">
                        {(stat.values as CountedItem[]).map((val, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <div className="flex justify-between items-center text-white text-[1rem]">
                                    <span className="font-medium">{val.label}</span>
                                    <span className="font-mono text-alien-primary">{val.count}% Match</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-alien-primary shadow-[0_0_8px_#00ff66] transition-all duration-1000"
                                        style={{width: `${val.count}%`}}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
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
                const widthMap = {
                    1: 'col-span-1',
                    2: 'col-span-2',
                    3: 'col-span-3'
                };

                const spanClass = widthMap[stat.width || 1];

                return (
                    <div
                        key={index}
                        className={`
                            interactive-panel
                            ${spanClass} 
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