import {ErrorBoundary} from "react-error-boundary";
import {ErrorFallback} from "../Utility/Handlers/ErrorFallback.tsx";
import {DataHandler} from "../Utility/Handlers/DataHandler.tsx";
import {ScoresList} from "../components/Lists/ScoresList/ScoresList.tsx"
import api from "../api.tsx";
import {useData} from "../Utility/hooks/useData.ts";
import {useState} from "react";

const fetchScores = (page: number) =>
    api.post('/api/get_score_page', {
        page: page,
        limit: 30
    }).then(res => res.data);

export const ScoreStatistics = () => {
    const [page, setPage] = useState(1);

    const scoresReq = useData(
        ['scores', page],
        () => fetchScores(page)
    );

    const scores = scoresReq.data?.scores || [];
    const totalPages = scoresReq.data?.total_pages || 1;

    return (
        <div
            style={{display: 'flex', gap: '20px', padding: '20px', paddingLeft: '100px', alignItems: 'flex-start'}}>
            <div style={{flex: '0 0 950px'}}>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <DataHandler
                        loading={scoresReq.loading}
                        error={scoresReq.error}
                        data={scoresReq.data}
                        label={"scores"}
                    >
                        <ScoresList
                            scores={scores}
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            isFetching={scoresReq.isFetching}
                        />
                    </DataHandler>
                </ErrorBoundary>
            </div>
        </div>
    );
}
