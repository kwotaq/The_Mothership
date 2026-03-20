import type {Player} from '../../../types/player.ts';

interface PlayerProps {
    player: Player;
    index: number;
    onToggle: (player: Player) => void;
    isActive: boolean;
    "data-id"?: string;
}

export const PlayerCard = ({player, index, onToggle, isActive, "data-id": dataId}: PlayerProps) => {
    return (
        <div
            onClick={() => onToggle(player)}
            data-id={dataId}
            className={`
                interactive-panel
                ${isActive ? 'active' : ''}
                [clip-path:polygon(0_0,calc(100%-15px)_0,100%_15px,100%_100%,15px_100%,0_calc(100%-15px))]
                flex items-center justify-between min-h-[95px] px-6 py-4 cursor-pointer group
            `}
        >
            <div className="flex items-center gap-6 flex-1 min-w-0 h-full">
                <div className="text-text-primary font-mono text-xl font-bold min-w-[40px] opacity-80 underline">
                    #{index}
                </div>

                <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-[65px] h-[65px] object-cover border border-alien-primary bg-bg-tertiary [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]"
                />

                <div className="flex flex-col justify-center min-w-0 self-stretch">
                    <h3 className="truncate leading-tight">
                        <a href={`https://osu.ppy.sh/users/${player._id}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-text-primary hover:underline text-2xl font-semibold tracking-wider uppercase transition-colors"
                           onClick={(e) => e.stopPropagation()}
                        >
                            {player.name}
                        </a>
                    </h3>
                    <span className="text-xs uppercase tracking-widest text-text-secondary font-mono mt-1">
                        Global_Rank: #{player.global_rank.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="flex-shrink-0 ml-4 flex items-center">
                <span className="inline-block w-[140px] py-1 text-center bg-alien-primary/5
                    border border-alien-primary/30 text-text-primary font-mono font-semibold text-lg
                    [clip-path:polygon(10%_0,100%_0,90%_100%,0_100%)]">
                    {player.performance_points.toLocaleString()}pp
                </span>
            </div>
        </div>
    );
};