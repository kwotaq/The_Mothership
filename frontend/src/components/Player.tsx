import type {Player as PlayerType} from '../types/player';
import React from "react";

interface PlayerProps {
  player: PlayerType;
}

const Player: React.FC<PlayerProps> = ({ player }) => {
  return (
    <div className="flat-list-item">
      <div className="player-main">
        <div className="country-rank">
          #{player.country_rank}
        </div>
        <img
          src={player.avatar}
          className="player-avatar"
        />
        <div className="player-details">
          <h3 className="player-name"><a href={"https://osu.ppy.sh/users/"+player._id}>{player.name}</a></h3>
          <div className="player-stats">
            <span className="global-rank">Global: #{player.global_rank}</span>
            <span className="performance-points">{player.performance_points.toLocaleString()} PP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;