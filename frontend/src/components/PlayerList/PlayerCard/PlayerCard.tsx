import type {Player} from '../../../types/player.ts';
import styles from "./PlayerCard.module.css"
import React from "react";

interface PlayerProps {
    player: Player;
    index: number;
    onToggle: (player: Player) => void;
    isActive: boolean;
    "data-id"?: string;
}

const PlayerCard: React.FC<PlayerProps> = ({player, index, onToggle, isActive, "data-id": dataId}) => {
    return (
        <div
            className={`${styles.listItem} ${isActive ? styles.activeItem : ''}`}
            onClick={() => onToggle(player)}
            data-id={dataId}
        >
            <div className={styles.playerMain}>
                <div className={styles.index}>
                    #{index}
                </div>
                <img
                    src={player.avatar}
                    className={styles.playerAvatar}
                />
                <div className={styles.playerDetails}>
                    <h3 className={styles.playerName}><a href={"https://osu.ppy.sh/users/" + player._id}>{player.name}</a>
                    </h3>
                    <div className={styles.playerStats}>
                        <span className={styles.countryRank}>Country: #{player.country_rank}</span>
                        <span className={styles.globalRank}>Global: #{player.global_rank}</span>
                    </div>
                </div>
            </div>
            <div>
                <span className={styles.performancePoints}>{player.performance_points.toLocaleString()}pp</span>
            </div>
        </div>
    );
};

export default PlayerCard;