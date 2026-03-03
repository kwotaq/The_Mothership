import {ScoreCard} from './ScoreCard/ScoreCard';
import type {Score} from '../../../types/score';
import styles from './ScoresList.module.css';

interface ScoresListProps {
    scores: Score[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isFetching?: boolean;
}

export const ScoresList = ({scores, currentPage, totalPages, onPageChange}: ScoresListProps) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.scrollViewport}>
                {scores.map(score => (
                    <ScoreCard key={score._id} score={score}/>
                ))}
            </div>

            <div className={styles.paginationBar}>
                <button
                    className={styles.navButton}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    &lt; PREV
                </button>
                <span className={styles.pageText}>PAGE: {currentPage} / {totalPages}</span>
                <button
                    className={styles.navButton}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    NEXT &gt;
                </button>
            </div>
        </div>
    );
};