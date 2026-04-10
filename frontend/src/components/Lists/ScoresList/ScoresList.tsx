import {ScoreCard} from './ScoreCard.tsx';
import type {Score} from '../../../types/score';

export const ScoresList = ({scores}: { scores: Score[] }) => {
    return (
        <div className="flex flex-col h-full">
            <div
                className="h-[calc(160vh)] overflow-y-auto overflow-x-hidden overscroll-contain pr-3"
            >
                <div className="flex flex-col gap-4">
                    {scores.map((score, index) => (
                        <ScoreCard
                            key={score._id}
                            score={score}
                            index={index + 1}
                        />
                    ))}
                </div>
            </div>

            <div
                className="flex items-center justify-center gap-10 p-5 bg-alien-primary/5 border-t-2 border-alien-primary mt-4">
                <div className="w-1.5 h-1.5 bg-alien-primary rotate-45"/>
                <span className="font-mono uppercase tracking-[0.3em] text-text-primary">
                / --------------------- /
            </span>
                <div className="w-1.5 h-1.5 bg-alien-primary rotate-45"/>
            </div>
        </div>
    );
};