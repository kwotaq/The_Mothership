import {ScoreCard} from './ScoreCard.tsx';
import type {Score} from '../../../types/score';
import {SectionHeader} from "../../../Utility/SectionHeader.tsx";

interface ScoresListProps {
    scores: Score[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isFetching?: boolean;
}

export const ScoresList = ({scores, currentPage, totalPages, onPageChange}: ScoresListProps) => {
    return (
        <div className="flex flex-col h-[calc(110vh)]">
            <SectionHeader title='Top Scores'/>

            <div className="flex-1 min-h-0 overflow-y-auto p-[15px] flex flex-col gap-2.5">
                {scores.map(score => (
                    <ScoreCard key={score._id} score={score}/>
                ))}
            </div>

            <div className="flex justify-center items-center gap-10 p-5 bg-alien-primary/5 border-t-2 border-alien-primary shrink-0">
                <button
                    className="btn-nav"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    &lt; PREV
                </button>

                <span className="text-white tracking-[3px] text-sm [text-shadow:0_0_5px_rgba(255,255,255,0.5)]">
                    PAGE: {currentPage} / {totalPages}
                </span>

                <button
                    className="btn-nav"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    NEXT &gt;
                </button>
            </div>
        </div>
    );
};