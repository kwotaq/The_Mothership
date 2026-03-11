import React from 'react';
import { usePlayers } from '../../../Utility/PlayerContext.tsx';
import type { Score } from '../../../types/score.ts';

interface ScoreCardProps {
    score: Score;
}

const rankStyles: Record<string, string> = {
    XH: "text-[#f2ff00] [text-shadow:0_0_10px_#f2ff00]",
    X: "text-[#f2ff00] [text-shadow:0_0_10px_#f2ff00]",
    SH: "text-[#00f2ff] [text-shadow:0_0_10px_#00f2ff]",
    S: "text-[#00f2ff] [text-shadow:0_0_10px_#00f2ff]",
    A: "text-[#00ff66]",
    B: "text-[#ff9d00]",
};

export const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
    const { playerMap } = usePlayers();
    const player = playerMap[score.user_id];

    const displayRank = (rank: string) => {
        if (rank === 'XH' || rank === 'X') return 'SS';
        if (rank === 'SH' || rank === 'S') return 'S';
        return rank;
    };

    return (
        <div className="relative w-full min-h-[120px] bg-[#050a08] border border-alien-primary/30 rounded shadow-sm overflow-hidden flex group">
            <img
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105"
                src={score.background_url}
                alt="map background"
            />
            <div className="absolute inset-0 bg-[#050a08]/90 z-[1]" />

            <div className="relative z-[2] w-full p-4 flex justify-between items-center">

                <div className="flex items-center gap-5">
                    <div className={`text-[42px] font-black italic min-w-[60px] text-center ${rankStyles[score.rank] || 'text-white'}`}>
                        {displayRank(score.rank)}
                    </div>

                    <div className="flex flex-col items-center gap-1 min-w-[65px]">
                        <img
                            src={player?.avatar}
                            className="w-[45px] h-[45px] border-2 border-alien-primary bg-black object-cover [clip-path:polygon(10%_0,100%_0,90%_100%,0%_100%)]"
                            alt={player?.name}
                        />
                        <span className="text-alien-primary text-[12px] font-mono font-extrabold uppercase tracking-tighter max-w-[75px] line-clamp-2 text-center break-all leading-[1.1] [text-shadow:0_0_5px_rgba(0,255,102,0.4)]">
                            {player?.name || 'Unknown'}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-[20px] block leading-tight">
                                {score.artist} - {score.title}
                            </span>
                            <span className="text-white/50 text-[10px] uppercase tracking-widest mt-0.5">
                                BY <span className="text-alien-primary/80">{score.creator}</span>
                            </span>
                        </div>
                        <div className="text-[13px] font-bold text-white bg-alien-primary/10 px-2.5 py-0.5 w-fit uppercase border border-alien-primary/20">
                            {score.difficulty}
                        </div>
                    </div>
                </div>

                <div className="flex gap-5 items-center justify-end min-w-[320px]">
                    <div className="flex flex-col items-end w-20">
                        <span className="text-[12px] text-alien-primary font-extrabold">PP</span>
                        <span className="text-[20px] text-white font-extrabold leading-none">{score.pp.toFixed(0)}</span>
                    </div>

                    <div className="flex flex-col items-end w-20">
                        <span className="text-[12px] text-alien-primary font-extrabold">ACC</span>
                        <span className="text-[20px] text-white font-extrabold leading-none">{(score.accuracy * 100).toFixed(2)}%</span>
                    </div>

                    <div className="flex justify-end min-w-[80px] shrink-0">
                        <div className="bg-alien-primary/10 text-alien-primary px-2.5 py-0.5 border border-alien-primary text-[12px] font-extrabold whitespace-nowrap shadow-[0_0_5px_rgba(0,255,102,0.2)]">
                            {score.mods}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};