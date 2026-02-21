import type {Player} from '../../types/player.ts';
import styles from './PlayerList.module.css';
import PlayerCard from './PlayerCard/PlayerCard.tsx';
import React, {useEffect, useRef} from "react";

interface PlayerListProps {
    players: Player[];
    loading: boolean;
    error: string | null;
    onToggle: (player: Player) => void;
    activePlayer: Player | null;

}

const PlayerList: React.FC<PlayerListProps> = ({players, loading, error, activePlayer, onToggle}) => {
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

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p className="text-gold">Loading players...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-state">
                    <h3 className="text-gold">Failed to Load Players</h3>
                    <p className="text-muted">{error}</p>
                </div>
            );
        }

        if (players.length === 0) {
            return (
                <div className="empty-state">
                    <h3>No Players Found</h3>
                    <p className="text-muted">There are no players to display at the moment.</p>
                </div>
            );
        }

        return (
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
        );
    };

    return (
        <div className={styles.dataListContainer}>
            <div className={styles.listHeader}>
                <h2>Player Rankings</h2>
            </div>
            {renderContent()}
        </div>
    );
};

export default PlayerList;