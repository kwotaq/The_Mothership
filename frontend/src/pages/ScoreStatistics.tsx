import {ErrorBoundary} from "react-error-boundary";
import {ErrorFallback} from "../Utility/Handlers/ErrorFallback.tsx";
import {DataHandler} from "../Utility/Handlers/DataHandler.tsx";
import {StatsBoard} from "../components/StatsBoard/StatsBoard.tsx";
import {ScoresList} from "../components/Lists/ScoresList/ScoresList.tsx"
import api from "../api.tsx";
import {useData} from "../Utility/hooks/useData.ts";

const fetchScores = () => api.get('/api/get_score_page').then(res => res.data);
const fetchStats = () => api.get('/api/get_score_stats').then(res => res.data);

export const ScoreStatistics = ()=> {
    const scoresReq = useData(['scores'], fetchScores);
    const statsReq = useData(['stats'], fetchStats);

 return (
        <div style={{
            display: 'flex',
            gap: '20px',
            padding: '20px',
            paddingLeft: '100px',
            alignItems: 'flex-start'
        }}>
            <div style={{flex: '0 0 950px'}}>

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

            {/*<div style={{flex: '1'}}>*/}
            {/*    <ErrorBoundary FallbackComponent={ErrorFallback}>*/}
            {/*        <DataHandler data={statsReq.data}*/}
            {/*                     loading={statsReq.loading}*/}
            {/*                     error={statsReq.error}*/}
            {/*                     label={"stats"}>*/}
            {/*            <StatsBoard*/}
            {/*                data={statsReq.data}*/}
            {/*            />*/}
            {/*        </DataHandler>*/}
            {/*    </ErrorBoundary>*/}
            {/*</div>*/}
        </div>
    );
}