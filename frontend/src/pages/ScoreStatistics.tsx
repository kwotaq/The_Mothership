import {ScoresList} from "../components/Lists/ScoresList/ScoresList.tsx"
import api from "../api.tsx";
import {useData} from "../Utility/hooks/useData.ts";
import {SectionHeader} from "../Utility/SectionHeader.tsx";
import {ErrorBoundary} from "react-error-boundary";
import {ErrorFallback} from "../Utility/Handlers/ErrorFallback.tsx";
import {DataHandler} from "../Utility/Handlers/DataHandler.tsx";
import {StatsBoard} from "../components/StatsBoard/StatsBoard.tsx";

const fetchScores = () => api.get('/api/get_top_scores').then(res => res.data);

const fetchStats = () => api.get("/api/get_global_score_metrics").then(res => ({...res.data, kind: 'scoreMetrics'}));

export const ScoreStatistics = () => {
    const scoresReq = useData(["scores"], fetchScores);

    const statsReq = useData(['scores_metrics'], fetchStats);

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
                        <ScoresList
                            scores={scoresReq.data}
                        />
                    </DataHandler>
                </ErrorBoundary>
            </div>

            <div className="flex-1 h-full px-20 flex flex-col gap-5 min-w-0">
                <div>
                    <SectionHeader title='Score Statistics'/>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <DataHandler
                            data={statsReq.data}
                            loading={statsReq.loading}
                            error={statsReq.error}
                            label={"stats"}
                        >
                            <StatsBoard
                                stats={statsReq.data}
                            />
                        </DataHandler>
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}