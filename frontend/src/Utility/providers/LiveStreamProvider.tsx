import React, {useEffect, useMemo, useState} from 'react';
import {type LiveScoreSeries, LiveStreamContext} from '../context/LiveStreamContext';
import {useData} from '../hooks/useData.ts';
import io from 'socket.io-client';
import api from '../../api.tsx';
import type {LiveScore} from '../../types/liveScore';

const socket = io("http://localhost:5000");

const fetchRecentScores = () => api.get<LiveScore[]>('/api/scores/recent').then(res => res.data);

export const LiveStreamProvider = ({children}: { children: React.ReactNode }) => {
    const [socketScores, setSocketScores] = useState<LiveScore[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    const {data: history, loading} = useData(['recent_scores'], fetchRecentScores);

    const historySeries = useMemo<LiveScoreSeries[]>(() => {
        if (!history || history.length === 0) return [];

        const series = history.reduce((acc: LiveScoreSeries[], score) => {
            const point = {x: score.ended_at, y: score.pp || 0, score};
            const existing = acc.find(s => s.id === score.user_id);

            if (existing) {
                existing.data.push(point);
            } else {
                acc.push({id: score.user_id, data: [point]});
            }
            return acc;
        }, []);

        series.forEach(s => {
            s.data.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
        });

        return series;
    }, [history]);

    const liveData = useMemo<LiveScoreSeries[]>(() => {
        const merged = historySeries.map(s => ({...s, data: [...s.data]}));

        for (const score of socketScores) {
            const point = {x: score.ended_at, y: score.pp || 0, score};
            const seriesIndex = merged.findIndex(s => s.id === score.user_id);

            if (seriesIndex > -1) {
                const series = merged[seriesIndex];
                if (series.data.some(p => p.score._id === score._id)) continue;

                series.data = [...series.data, point]
                    .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime())
                    .slice(-50);
            } else {
                merged.push({id: score.user_id, data: [point]});
            }
        }

        return merged;
    }, [historySeries, socketScores]);

    useEffect(() => {
        const handleNewScore = (score: LiveScore) => {
            setSocketScores(prev => {
                if (prev.some(s => s._id === score._id)) return prev;
                return [...prev, score];
            });
        };

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
        socket.on('new_live_score', handleNewScore);

        return () => {
            socket.off('new_live_score', handleNewScore);
        };
    }, []);

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