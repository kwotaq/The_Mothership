import React, { useMemo } from 'react';
import { PlayerContext } from '../context/PlayerContext.tsx';
import { useData } from '../hooks/useData.ts';
import api from '../../api.tsx';
import type { Player } from '../../types/player.ts';

const fetchPlayers = () => api.get('/api/players').then(res => res.data);

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