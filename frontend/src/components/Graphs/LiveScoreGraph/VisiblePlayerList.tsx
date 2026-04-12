import {usePlayers} from "../../../utility/context/playerContext.tsx";
import {useMemo, useState} from "react";
import {COLOR_PALETTE} from "./colorPalette.ts";
import {SearchBox} from "../../../utility/SearchBox.tsx";

export interface TransformedScoreSeries {
    id: string;
    data: {
        x: Date;
        y: number;
    }[];
}

interface VisiblePointProps {
    visiblePoints: TransformedScoreSeries[];
    activePlayerId: string | null;
    setActivePlayerId: (id: string | null) => void;
}

export const VisiblePlayerList = ({visiblePoints, activePlayerId, setActivePlayerId}: VisiblePointProps) => {
    const {playerMap} = usePlayers();
    const [isClicked, setIsClicked] = useState(false);
    const [filter, setFilter] = useState<string>('');

    const colorIndexMap = useMemo(() =>
            Object.fromEntries(visiblePoints.map((series, i) => [series.id, i]))
        , [visiblePoints]);

    return (
        <div className="w-full lg:w-64 h-auto max-h-[450px] lg:h-[600px] lg:max-h-none bg-bg-primary border border-alien-primary p-3 sm:p-4 flex flex-col gap-2 overflow-y-auto ">
            <div className="flex items-center justify-between border-b border-alien-primary pb-2 mb-1 sm:mb-2">
                    <span className="text-xs font-bold uppercase text-text-primary tracking-widest">
                        Visible Players
                    </span>
            </div>
            <div className="pb-2"><SearchBox setFilter={setFilter}/></div>
            <div
                className="w-full flex flex-col gap-2 overflow-y-auto custom-scrollbar shadow-lg">

                <div className="flex flex-row lg:flex-col flex-wrap lg:flex-nowrap">
                    {visiblePoints.filter(series => series.data.length > 0
                        && playerMap[series.id]?.name?.toLowerCase().includes(filter.toLowerCase())).map((series) => {
                        const player = playerMap[series.id]
                        const playerName = player.name || `User ${series.id}`;
                        const color = COLOR_PALETTE[colorIndexMap[series.id] % COLOR_PALETTE.length];
                        const isActive = activePlayerId === series.id;

                        return (
                            <div
                                key={series.id}
                                onMouseEnter={() => !isClicked && setActivePlayerId(series.id)}
                                onClick={() => isClicked ? setIsClicked(false) : setIsClicked(true)}
                                onMouseLeave={() => !isClicked && setActivePlayerId(null)}
                                className={`flex items-center gap-2 p-1.5 sm:p-2 transition-all group cursor-pointer flex-1 min-w-[120px] lg:min-w-0
                                ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                                ${activePlayerId && !isActive ? 'opacity-40' : 'opacity-100'}`}
                            >
                                <span
                                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                                    style={{
                                        backgroundColor: color,
                                        boxShadow: `0 0 10px ${color}66`
                                    }}
                                />
                                <span
                                    className={`text-xs sm:text-sm truncate font-medium transition-colors ${
                                        isActive ? 'text-white' : 'text-text-primary'
                                    }`} title={playerName}>
                                    <a href={`https://osu.ppy.sh/users/${player._id}`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-text-primary hover:underline"
                                       onClick={(e) => e.stopPropagation()}
                                    >
                                        {player.name}
                                    </a>
                                </span>
                            </div>
                        );
                    })}

                    {visiblePoints.filter(s => s.data.length > 0).length === 0 && (
                        <div className="text-text-tertiary text-xs italic py-4 text-center">
                            Waiting for scores...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}