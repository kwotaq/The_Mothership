import { createContext, useContext } from 'react';
import type { Player } from '../types/player';

interface PlayerContextType {
    players: Player[];
    playerMap: Record<string, Player>;
    loading: boolean;
    isFetching: boolean;
    error: string | null;
    refetch: () => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayers = () => {
    const context = useContext(PlayerContext);
    if (!context) throw new Error("usePlayers must be used within PlayerProvider");
    return context;
};