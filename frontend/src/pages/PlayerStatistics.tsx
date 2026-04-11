import {useState} from "react";
import {useData} from "../utility/hooks/useData.ts";
import {ErrorBoundary} from 'react-error-boundary';
import api from "../api.tsx";
import {StatsBoard} from "../components/StatsBoard/StatsBoard.tsx";
import type {Player} from "../types/player.ts";
import {DataHandler} from "../utility/handlers/DataHandler.tsx";
import {ErrorFallback} from "../utility/handlers/ErrorFallback.tsx";
import {ScatterPlot} from "../components/Graphs/ScatterPlot.tsx";
import {SectionHeader} from "../utility/SectionHeader.tsx";
import {PlayerPanel} from "../components/Lists/PlayerList/PlayerPanel.tsx";

const fetchCoordinates = () => api.get('/api/players/similarity').then(res => res.data.similarity_coordinates);

export const PlayerStatistics = () => {

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
        <div className="flex flex-col lg:flex-row gap-5 p-5 items-start w-full">
            <div className="flex-1 h-full lg:px-10 flex flex-col gap-8 sm:gap-12 min-w-0 w-full">
                <div className="w-full">
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

                <div className="w-full">
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

            <PlayerPanel onToggle={handleTogglePlayer} activePlayer={activePlayer}/>
        </div>
    );
}