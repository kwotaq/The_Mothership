// components/PlayerList.tsx
import type { Player as PlayerType } from '../types/player';
import Player from './Player';
import React from "react";

interface PlayerListProps {
  players: PlayerType[];
  loading: boolean;
  error: string | null;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, loading, error }) => {

  if (loading) {
    return (
      <div className="data-list-container">
        <div className="list-header">
          <h2>Player Rankings</h2>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p className="text-gold">Loading players...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-list-container">
        <div className="list-header">
          <h2>Player Rankings</h2>
          <div className="item-count error-count">Error</div>
        </div>
        <div className="error-state">
          <h3 className="text-gold">Failed to Load Players</h3>
          <p className="text-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="data-list-container">
        <div className="list-header">
          <h2>Player Rankings</h2>
        </div>
        <div className="empty-state">
          <h3>No Players Found</h3>
          <p className="text-muted">There are no players to display at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-list-container">
      <div className="list-header">
        <h2>Player Rankings</h2>
      </div>
      <div className="flat-list">
        {players.map((player) => (
          <Player key={player._id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default PlayerList;