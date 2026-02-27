import type {Score} from "../../../types/score.ts";
import styles from "../PlayerList/PlayerList.module.css";
import {SectionHeader} from "../../../Utility/SectionHeader/SectionHeader.tsx";

export const ScoresList = ({scores}: Score[]) => {
    return <div className={styles.dataListContainer}>
        <SectionHeader title='Player Rankings'/>
        <div className={styles.scrollContainer}>
            <div className={styles.flatList}>
                {scores.map((score, index) => (
                    <ScoreCard
                        key={score._id}
                        score={score}
                        index={index + 1}
                    />
                ))}
            </div>
        </div>
    </div>
}