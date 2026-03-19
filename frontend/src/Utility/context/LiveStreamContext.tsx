import { createContext, useContext } from 'react';
import type { LiveScore } from '../../types/liveScore';

export interface LiveScorePoint {
    x: string;
    y: number;
    score: LiveScore;
}

export interface LiveScoreSeries {
    id: string;
    data: LiveScorePoint[];
}

interface LiveStreamContextType {
    liveData: LiveScoreSeries[];
    isConnected: boolean;
}

export const LiveStreamContext = createContext<LiveStreamContextType | undefined>(undefined);

export const useLiveStream = () => {
    const context = useContext(LiveStreamContext);
    if (!context) throw new Error("useLiveStream must be used within LiveStreamProvider");
    return context;
};