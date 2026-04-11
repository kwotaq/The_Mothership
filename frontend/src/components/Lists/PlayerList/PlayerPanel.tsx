import {usePlayers} from "../../../utility/context/playerContext.tsx";
import {useMemo, useState} from "react";
import {SectionHeader} from "../../../utility/SectionHeader.tsx";
import {ErrorBoundary} from "react-error-boundary";
import {SearchBox} from "../../../utility/SearchBox.tsx";
import {ErrorFallback} from "../../../utility/handlers/ErrorFallback.tsx";
import {DataHandler} from "../../../utility/handlers/DataHandler.tsx";
import {PlayerList} from "./PlayerList.tsx";
import type {Player} from "../../../types/player.ts";

export const PlayerPanel = ({onToggle, activePlayer}: {
    onToggle: (player: Player) => void,
    activePlayer: Player | null
}) => {
    const {players, loading, error} = usePlayers();
    const [filter, setFilter] = useState<string>('');

    const filteredPlayers = useMemo(() => {
        if (!players || !filter) return players;
        return players.filter(p =>
            p.name.toLowerCase().includes(filter.toLowerCase())
        );
    }, [players, filter]);

    return (
        <div className="w-full lg:w-[40%] shrink-0 pr-4">
            <div className="pb-6">
                <SectionHeader title='Player Rankings'/>
                <SearchBox setFilter={setFilter}/>
            </div>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <DataHandler loading={loading} error={error} data={players} label="players">
                    <PlayerList
                        players={filteredPlayers}
                        onToggle={onToggle}
                        activePlayer={activePlayer}
                    />
                </DataHandler>
            </ErrorBoundary>
        </div>
    );
};