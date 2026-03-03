import React from 'react';
import {usePlayers} from '../../../../Utility/PlayerContext';
import type {Score} from '../../../../types/score.ts';
import styles from './ScoreCard.module.css';

interface ScoreCardProps {
    score: Score;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
    const { playerMap } = usePlayers();
    const player = playerMap[score.user_id];

    const displayRank = (rank: string) => {
        if (rank === 'XH' || rank === 'X') return 'SS';
        if (rank === 'SH' || rank === 'S') return 'S';
        return rank;
    };

    return (
        <div
            className={styles.card}>
            <img className={styles.cardBackgroundImage}
                src={score.background_url}
            />
            <div className={styles.backgroundBlur}/>

            <div className={styles.content}>
                <div className={styles.leftSection}>
                    <div className={`${styles.rank} ${styles[score.rank]}`}>
                        {displayRank(score.rank)}
                    </div>

                    <img
                        src={player?.avatar}
                        className={styles.avatar}
                        alt={player?.name}
                    />

                    <div className={styles.metaInfo}>
                        <div className={styles.titleGroup}>
                            <span className={styles.artistTitle}>{score.artist} - {score.title}</span>
                            <span className={styles.creator}>
                                <span className={styles.statLabel}>BY {score.creator}</span>
                            </span>
                        </div>
                        <div className={styles.diffBadge}>
                            {score.difficulty}
                        </div>
                    </div>
                </div>

                <div className={styles.statsSection}>
                    <div className={styles.statGroup}>
                        <span className={styles.label}>PP</span>
                        <span className={styles.statValue}>{score.pp.toFixed(0)}</span>
                    </div>
                    <div className={styles.statGroup}>
                        <span className={styles.label}>ACC</span>
                        <span className={styles.statValue}>{(score.accuracy * 100).toFixed(2)}%</span>
                    </div>
                    <div className={styles.mods}>{score.mods}</div>
                </div>
            </div>
        </div>
    );
};