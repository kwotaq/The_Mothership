import React, { useMemo } from 'react';
import { PlayerContext } from './PlayerContext';
import { useData } from './hooks/useData';
import api from '../api';
import type { Player } from '../types/player';

const fetchPlayers = () => api.get('/api/get_all_player_info').then(res => res.data);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: players, loading, error, isFetching, refetch } = useData<Player[]>(['players'], fetchPlayers);

    const playerMap = useMemo(() => {
        const map: Record<string, Player> = {};
        (players || []).forEach(p => { map[p._id] = p; });
        return map;
    }, [players]);

    const value = useMemo(() => ({
        players: players || [],
        playerMap,
        loading,
        isFetching,
        error,
        refetch
    }), [players, playerMap, loading, isFetching, error, refetch]);

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
};