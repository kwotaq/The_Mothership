import {ScoresList} from "../components/Lists/ScoresList/ScoresList.tsx";
import api from "../api.tsx";
import {useData} from "../utility/hooks/useData.ts";
import {SectionHeader} from "../utility/SectionHeader.tsx";
import {ErrorBoundary} from "react-error-boundary";
import {ErrorFallback} from "../utility/handlers/ErrorFallback.tsx";
import {DataHandler} from "../utility/handlers/DataHandler.tsx";
import {StatsBoard} from "../components/StatsBoard/StatsBoard.tsx";
import {LiveScoreGraph} from "../components/Graphs/LiveScoreGraph/LiveScoreGraph.tsx";
import {useLiveStream} from "../utility/context/liveStreamContext.tsx";

const fetchScores = () => api.get('/api/scores').then(res => res.data);
const fetchStats = () => api.get("/api/scores/metrics/global").then(res => ({...res.data, kind: 'scoreMetrics'}));

export const ScoreStatistics = () => {
    const scoresReq = useData(["scores"], fetchScores);
    const statsReq = useData(['scores_metrics'], fetchStats);

    const {liveData, isConnected} = useLiveStream();

    return (
        <div className="w-full px-4 sm:px-6 lg:px-20 p-7">
            <div>
                <SectionHeader title='Live Score Stream'/>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <div
                        className="min-h-[300px] sm:min-h-[400px] w-full relative">
                        {!isConnected && (
                            <div
                                className="absolute inset-0 flex items-center justify-center z-10bg-black/20">
                                <span className="text-alien-primary font-mono text-xs">
                                </span>
                            </div>
                        )}
                        <LiveScoreGraph data={liveData}/>
                    </div>
                </ErrorBoundary>
            </div>

            <div className="flex flex-col lg:flex-row gap-5 lg:gap-20 mt-5 lg:mt-8">
                <div className="w-full lg:w-[60%] shrink-0">
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

                <div className="flex-1 h-full flex flex-col min-w-0">
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