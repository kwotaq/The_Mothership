// components/PlayerList.tsx
import type { Player as PlayerType } from '../../types/player.ts';
import styles from './PlayerList.module.css';
import PlayerCard from '../PlayerCard/PlayerCard.tsx';
import React from "react";

interface PlayerListProps {
  players: PlayerType[];
  loading: boolean;
  error: string | null;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, loading, error }) => {

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
      <div className={styles.flatList}>
        {players.map((player, index) => (
          <PlayerCard key={player._id} player={player} index={index + 1} />
        ))}
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