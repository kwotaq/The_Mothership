import {useState} from "react";
import {PlayerList} from "../components/PlayerList/PlayerList.tsx";
import {useData} from "../hooks/useData.ts";
import {ErrorBoundary} from 'react-error-boundary';
import api from "../api.tsx";
import {StatsBoard} from "../components/StatsBoard/StatsBoard.tsx";
import type {Player} from "../types/player.ts";
import {DataHandler} from "../components/Handlers/DataHandler.tsx";
import {ErrorFallback} from "../components/Handlers/ErrorFallback.tsx";
import {ScatterPlot} from "../components/Graphs/ScatterPlot/ScatterPlot.tsx";

const fetchPlayers = () => api.get('/api/get_all_player_info').then(res => res.data);
const fetchCoordinates = () => api.get('/api/get_similarity_coordinates').then(res => res.data.similarity_coordinates);

export const PlayerStatistics = () => {
    const playersReq = useData(['players'], fetchPlayers);
    const coordinatesReq = useData(['coordinates'], fetchCoordinates);

    const [activePlayer, setActivePlayer] = useState<Player | null>(null);

    const fetchStats = async (playerId: string | undefined) => {
        if (!playerId) {
            const response = await api.get('/api/get_global_stats');
            return response.data;
        }

        const response = await api.post('/api/get_player_stats', {player_id: playerId});
        return response.data;
    };

    const statsReq = useData(
        ['player_stats', activePlayer?._id],
        () => fetchStats(activePlayer?._id)
    );

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
            <div style={{flex: '0 0 950px'}}>

                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <DataHandler
                        loading={playersReq.loading}
                        error={playersReq.error}
                        data={playersReq.data}
                        label={"players"}
                    >
                        <PlayerList
                            players={playersReq.data}
                            onToggle={handleTogglePlayer}
                            activePlayer={activePlayer}
                        />
                    </DataHandler>
                </ErrorBoundary>
            </div>

            <div style={{flex: '1'}}>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <DataHandler
                        loading={coordinatesReq.loading || playersReq.loading}
                        error={coordinatesReq.error || playersReq.error}
                        data={(!coordinatesReq.loading && !playersReq.loading) ? coordinatesReq.data : null}
                        label={"coordinates"}
                    >
                        <ScatterPlot
                            data={coordinatesReq.data}
                            playerData={playersReq.data}
                            onToggle={handleTogglePlayer}
                            activePlayer={activePlayer}
                        />
                    </DataHandler>
                </ErrorBoundary>

                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <DataHandler data={statsReq.data}
                                 loading={statsReq.loading}
                                 error={statsReq.error}
                                 label={"stats"}>
                        <StatsBoard
                            data={statsReq.data}
                        />
                    </DataHandler>
                </ErrorBoundary>
            </div>
        </div>
    );
}