import React, {useEffect, useMemo, useState} from 'react';
import {type LiveScoreSeries, LiveStreamContext} from '../context/liveStreamContext.tsx';
import {useData} from '../hooks/useData.ts';
import io from 'socket.io-client';
import api from '../../api.tsx';
import type {LiveScore} from '../../types/liveScore';

const socket = io(import.meta.env.VITE_API_URL, {
    transports: ['websocket'],
    reconnectionDelay: 500,
    reconnectionAttempts: 5
});

const fetchRecentScores = () => api.get<LiveScore[]>('/api/scores/recent').then(res => res.data);

const scoreToPoint = (score: LiveScore) => ({
    x: score.ended_at,
    y: score.pp || 0
});

const toSeries = (scores: LiveScore[]): LiveScoreSeries[] => {
    const series = scores.reduce((acc: LiveScoreSeries[], score) => {
        const existing = acc.find(s => s.id === score.user_id);
        if (existing) {
            existing.data.push(scoreToPoint(score));
        } else {
            acc.push({id: score.user_id, data: [scoreToPoint(score)]});
        }
        return acc;
    }, []);

    series.forEach(s => {
        s.data.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
    });

    return series;
};

export const LiveStreamProvider = ({children}: { children: React.ReactNode }) => {
    const [socketScores, setSocketScores] = useState<LiveScore[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    const {data: history, loading} = useData(['recent_scores'], fetchRecentScores);

    const liveData = useMemo<LiveScoreSeries[]>(() => {
        const allScores = [...(history || []), ...socketScores];
        return toSeries(allScores);
    }, [history, socketScores]);

    useEffect(() => {
        const handleNewScore = (score: LiveScore) => {
            setSocketScores(prev => {
                if (prev.some(s => s._id === score._id)) return prev;
                if (history?.some(s => s._id === score._id)) return prev;
                return [...prev, score];
            });
        };

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
        socket.on('new_live_score', handleNewScore);

        return () => {
            socket.off('new_live_score', handleNewScore);
        };
    }, [history]);

    const value = useMemo(() => ({
        liveData,
        isConnected: isConnected && !loading
    }), [liveData, isConnected, loading]);

    return (
        <LiveStreamContext.Provider value={value}>
            {children}
        </LiveStreamContext.Provider>
    );
};