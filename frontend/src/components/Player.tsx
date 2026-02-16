import type {Player as PlayerType} from '../types/player';
import React from "react";

interface PlayerProps {
  player: PlayerType;
  index: number;
}

const Player: React.FC<PlayerProps> = ({ player, index }) => {
  return (
    <div className="flat-list-item">
      <div className="player-main">
        <div className="index">
          #{index}
        </div>
        <img
          src={player.avatar}
          className="player-avatar"
        />
        <div className="player-details">
          <h3 className="player-name"><a href={"https://osu.ppy.sh/users/"+player._id}>{player.name}</a></h3>
          <div className="player-stats">
            <span className="country-rank">Country: #{player.country_rank}</span>
            <span className="global-rank">Global: #{player.global_rank}</span>
          </div>
        </div>
      </div>
      <div>
        <span className="performance-points">{player.performance_points.toLocaleString()}pp</span>
      </div>
    </div>
  );
};

export default Player;