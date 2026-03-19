import {useState} from "react";
import {PlayerList} from "../components/Lists/PlayerList/PlayerList.tsx";
import {useData} from "../Utility/hooks/useData.ts";
import {ErrorBoundary} from 'react-error-boundary';
import api from "../api.tsx";
import {StatsBoard} from "../components/StatsBoard/StatsBoard.tsx";
import type {Player} from "../types/player.ts";
import {DataHandler} from "../Utility/handlers/DataHandler.tsx";
import {ErrorFallback} from "../Utility/handlers/ErrorFallback.tsx";
import {ScatterPlot} from "../components/graphs/ScatterPlot.tsx";
import {usePlayers} from "../Utility/context/PlayerContext.tsx";
import {SectionHeader} from "../Utility/SectionHeader.tsx";

const fetchCoordinates = () => api.get('/api/players/similarity').then(res => res.data.similarity_coordinates);

export const PlayerStatistics = () => {
    const {players, loading: playersLoading, error: playersError} = usePlayers();

    const coordinatesReq = useData(['coordinates'], fetchCoordinates);

    const [activePlayer, setActivePlayer] = useState<Player | null>(null);

    const fetchStats = async (playerId: string | undefined) => {
        if (!playerId) {
            const response = await api.get('/api/players/metrics/global');
            return {
                ...response.data,
                kind: 'globalMetrics'
            };
        }
        const response = await api.post('/api/players/metrics', {player_id: playerId});
        return {
            ...response.data,
            kind: 'playerMetrics'
        };
    };

    const statsReq = useData(
        ['player_stats', activePlayer?._id],
        () => fetchStats(activePlayer?._id)
    );

    const handleTogglePlayer = (player: Player) => {
        setActivePlayer((prev) => (prev?._id === player._id ? null : player));
    };

    return (
        <div className="flex gap-5 p-5 pl-20 items-start">
            <div className="w-[40%] shrink-0">
                <SectionHeader title='Player Rankings'/>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <DataHandler
                        loading={playersLoading}
                        error={playersError}
                        data={players}
                        label={"players"}
                    >
                        <PlayerList
                            players={players}
                            onToggle={handleTogglePlayer}
                            activePlayer={activePlayer}
                        />
                    </DataHandler>
                </ErrorBoundary>
            </div>

            <div className="flex-1 h-full px-20 flex flex-col gap-5 min-w-0">
                <div>
                    <SectionHeader title='Player Similarity Map'/>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <DataHandler
                            loading={coordinatesReq.loading}
                            error={coordinatesReq.error}
                            data={coordinatesReq.data}
                            label={"coordinates"}
                        >
                            <ScatterPlot
                                data={coordinatesReq.data}
                                onToggle={handleTogglePlayer}
                                activePlayer={activePlayer}
                            />
                        </DataHandler>
                    </ErrorBoundary>
                </div>

                <div>
                    <SectionHeader title='Player Statistics'/>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <DataHandler
                            data={statsReq.data}
                            loading={statsReq.loading}
                            error={statsReq.error}
                            label={"stats"}
                        >
                            <StatsBoard
                                stats={statsReq.data}
                            />
                        </DataHandler>
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}