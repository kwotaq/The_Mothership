import { useState } from "react";
import PlayerList from "../components/PlayerList/PlayerList.tsx";
import { useData } from "../hooks/useData.ts";
import api from "../api.tsx";
import StatsBoard from "../components/StatsBoard/StatsBoard.tsx";
import type { Player } from "../types/player.ts";

const fetchPlayers = () => api.get('/api/player_info_list').then(res => res.data);
const fetchPlayerStats = () => api.get('/api/get_global_stats').then(res => res.data);

function PlayerStatistics() {
    const playersReq = useData(['players'], fetchPlayers);
    const statsReq = useData(['global_stats'], fetchPlayerStats);

    const [activePlayer, setActivePlayer] = useState<Player | null>(null);

    const handleTogglePlayer = (player: Player) => {
        setActivePlayer((prev) => (prev?._id === player._id ? null : player));
    };

    return (
        <div style={{
            display: 'flex',
            gap: '20px',
            padding: '20px',
            paddingLeft: '100px',
            alignItems: 'flex-start'
        }}>
            <div style={{ flex: '0 0 950px' }}>
                <PlayerList
                    players={playersReq.data || []}
                    loading={playersReq.loading}
                    error={playersReq.error}
                    activePlayer={activePlayer}
                    onToggle={handleTogglePlayer}
                />
            </div>

            <div style={{ flex: '1' }}>
                <StatsBoard
                    data={statsReq.data}
                    playerData={playersReq.data || []}
                    loading={statsReq.loading}
                    error={statsReq.error}
                    activePlayer={activePlayer}
                    onToggle={handleTogglePlayer}
                />
            </div>
        </div>
    );
}

export default PlayerStatistics;