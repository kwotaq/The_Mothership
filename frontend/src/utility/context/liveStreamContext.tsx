import { createContext, useContext } from 'react';
import type {LiveScore} from "../../types/liveScore.ts";

export interface LiveScorePoint {
    x: LiveScore['ended_at'];
    y: LiveScore['pp'];
    _id: LiveScore['_id']
}

export interface LiveScoreSeries {
    id: LiveScore['user_id'];
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