import {usePlayers} from '../../../utility/context/playerContext.tsx';
import type {Score} from '../../../types/score.ts';

const rankStyles: Record<string, string> = {
    XH: "text-[#f2ff00] [text-shadow:0_0_10px_#f2ff00]",
    X: "text-[#f2ff00] [text-shadow:0_0_10px_#f2ff00]",
    SH: "text-[#00f2ff] [text-shadow:0_0_10px_#00f2ff]",
    S: "text-[#00f2ff] [text-shadow:0_0_10px_#00f2ff]",
    A: "text-[#00ff66]",
    B: "text-[#ff9d00]",
};

export const ScoreCard = ({score, index}: { score: Score; index: number }) => {
    const {playerMap} = usePlayers();
    const player = playerMap[score.user_id];

    const displayRank = (rank: string) => {
        if (rank === 'XH' || rank === 'X') return 'SS';
        if (rank === 'SH' || rank === 'S') return 'S';
        return rank;
    };

    return (
        <div
            className="interactive-panel relative w-full min-h-[120px] rounded shadow-sm overflow-hidden flex group cursor-pointer"
            onClick={() => window.open(`https://osu.ppy.sh/scores/${score._id}`, '_blank')}
        >
            <img
                className="absolute inset-0 w-full h-full object-cover z-0"
                src={score.background_url}
                alt="map background"
            />
            <div className="absolute inset-0 bg-[#050a08]/85 z-[1]"/>

            <div
                className="relative z-[2] w-full py-2.5 px-3 sm:py-3 sm:px-4 flex flex-wrap items-center gap-x-3 gap-y-2">

                <div className="flex items-center gap-1.5 min-w-0">
                    <div
                        className="text-xl sm:text-2xl font-mono font-black text-white w-9 sm:w-11 shrink-0 underline italic">
                        #{index}
                    </div>

                    <div className="flex flex-col items-center justify-center w-[65px] sm:w-[75px] shrink-0">
                        <img
                            src={player?.avatar}
                            className="w-[38px] h-[38px] sm:w-[45px] sm:h-[45px] border-2 border-alien-primary bg-black object-cover [clip-path:polygon(10%_0,100%_0,90%_100%,0%_100%)]"
                            alt={player?.name}
                        />
                        <a href={`https://osu.ppy.sh/users/${player._id}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-alien-primary hover:underline text-[9px] sm:text-[10px] font-mono font-extrabold uppercase tracking-tight w-full truncate text-center mt-0.5"
                           onClick={(e) => e.stopPropagation()}
                        >
                            {player.name}
                        </a>
                    </div>

                    <div
                        className={`text-3xl sm:text-[42px] font-black italic w-[55px] sm:w-[70px] shrink-0 text-center leading-none ${rankStyles[score.rank] || 'text-white'}`}>
                        {displayRank(score.rank)}
                    </div>
                </div>

                <div className="flex-1 min-w-[200px] flex flex-col gap-0.5">
                    <span className="text-white font-bold text-sm sm:text-base leading-tight truncate">
                        <a href={`https://osu.ppy.sh/beatmapsets/${score.beatmap_id}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="hover:underline"
                           onClick={(e) => e.stopPropagation()}
                        >
                        {score.artist} - {score.title}
                        </a>
                    </span>
                    <span className="text-white/50 text-[8px] sm:text-[10px] uppercase tracking-wider">
                        BY <span className="text-alien-primary/80">{score.creator}</span>
                    </span>
                    <div
                        className="text-[9px] sm:text-[11px] font-bold text-white bg-alien-primary/10 px-2 py-0.5 w-fit max-w-full uppercase border border-alien-primary/20 mt-0.5 truncate"
                        title={score.difficulty}>
                        {score.difficulty}
                    </div>
                </div>

                <div className="flex items-center gap-5 sm:gap-10 ml-auto">
                    <div className="flex flex-col items-end w-14 sm:w-16">
                        <span
                            className="text-[10px] sm:text-xs text-alien-primary font-extrabold uppercase tracking-wide">PP</span>
                        <span className="text-base sm:text-xl text-white font-extrabold leading-none">
                            {score.pp.toFixed(0)}
                        </span>
                    </div>

                    <div className="flex flex-col items-end w-14 sm:w-16">
                        <span
                            className="text-[10px] sm:text-xs text-alien-primary font-extrabold uppercase tracking-wide">ACC</span>
                        <span className="text-base sm:text-xl text-white font-extrabold leading-none">
                            {(score.accuracy * 100).toFixed(2)}%
                        </span>
                    </div>

                    <div className="shrink-0">
                        <div
                            className="bg-alien-primary/10 text-alien-primary px-1 sm:px-2.0 py-0.5 border border-alien-primary text-[12px] sm:text-xs font-extrabold whitespace-nowrap">
                            {score.mods}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};