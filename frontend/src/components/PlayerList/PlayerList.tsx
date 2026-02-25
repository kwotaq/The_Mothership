import type {Player} from '../../types/player.ts';
import styles from './PlayerList.module.css';
import {PlayerCard} from './PlayerCard/PlayerCard.tsx';
import {useEffect, useRef} from "react";

interface PlayerListProps {
    players: Player[];
    onToggle: (player: Player) => void;
    activePlayer: Player | null;

}

export const PlayerList = ({players, activePlayer, onToggle}: PlayerListProps) => {
    const listContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activePlayer && listContainerRef.current) {
            const activeElement = listContainerRef.current.querySelector(
                `[data-id="${activePlayer._id}"]`
            );

            if (activeElement) {
                activeElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "start"
                });
            }
        }
    }, [activePlayer]);

    return (
        <div className={styles.dataListContainer}>
            <div className={styles.listHeader}>
                <h2>Player Rankings</h2>
            </div>
            <div className={styles.scrollContainer} ref={listContainerRef}>
                <div className={styles.flatList}>
                    {players.map((player, index) => (
                        <PlayerCard
                            key={player._id}
                            player={player}
                            index={index + 1} onToggle={onToggle}
                            isActive={activePlayer?._id === player._id}
                            data-id={player._id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};