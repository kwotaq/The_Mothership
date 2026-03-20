import {ScoresList} from "../components/Lists/ScoresList/ScoresList.tsx";
import api from "../api.tsx";
import {useData} from "../utility/hooks/useData.ts";
import {SectionHeader} from "../utility/SectionHeader.tsx";
import {ErrorBoundary} from "react-error-boundary";
import {ErrorFallback} from "../utility/handlers/ErrorFallback.tsx";
import {DataHandler} from "../utility/handlers/DataHandler.tsx";
import {StatsBoard} from "../components/StatsBoard/StatsBoard.tsx";
import {LiveScoreGraph} from "../components/Graphs/LiveScoreGraph.tsx";
import {useLiveStream} from "../utility/context/liveStreamContext.tsx";

const fetchScores = () => api.get('/api/scores/top').then(res => res.data);
const fetchStats = () => api.get("/api/scores/metrics/global").then(res => ({...res.data, kind: 'scoreMetrics'}));

export const ScoreStatistics = () => {
    const scoresReq = useData(["scores"], fetchScores);
    const statsReq = useData(['scores_metrics'], fetchStats);

    const {liveData, isConnected} = useLiveStream();

    return (
        <div className="flex gap-5 p-5 pl-20 items-start">
            <div className="w-[40%] shrink-0">
                <SectionHeader title='Top Scores'/>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <DataHandler
                        loading={scoresReq.loading}
                        error={scoresReq.error}
                        data={scoresReq.data}
                        label={"scores"}
                    >
                        <ScoresList scores={scoresReq.data}/>
                    </DataHandler>
                </ErrorBoundary>
            </div>

            <div className="flex-1 h-full px-20 flex flex-col gap-5 min-w-0">
                <div>
                    <SectionHeader title='Live Score Stream'/>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <div
                            className="min-h-[400px] w-full border border-alien-primary/20 rounded bg-bg-secondary/30 relative">
                            {!isConnected && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center z-10 bg-black/20">
                        <span className="text-alien-primary animate-pulse font-mono text-xs">
                        </span>
                                </div>
                            )}
                            <LiveScoreGraph data={liveData}/>
                        </div>
                    </ErrorBoundary>
                </div>

                <div>
                    <SectionHeader title='Score Statistics'/>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <DataHandler
                            data={statsReq.data}
                            loading={statsReq.loading}
                            error={statsReq.error}
                            label={"stats"}
                        >
                            <StatsBoard stats={statsReq.data}/>
                        </DataHandler>
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}