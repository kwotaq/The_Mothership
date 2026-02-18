import PlayerList from "../components/PlayerList/PlayerList.tsx";
import {useData} from "../hooks/useData.ts";
import api from "../api.tsx";
import StatsBoard from "../components/StatsBoard/StatsBoard.tsx";

const fetchPlayers = () =>
    api.get('/api/player_info_list').then(res => res.data);

const fetchPlayerStats = () =>
    api.get('/api/get_global_stats').then(res => res.data);

function Home() {
    const playersReq = useData(['players'], fetchPlayers);
    const statsReq = useData(['global_stats'], fetchPlayerStats);

    return (
        <div style={{
            display: 'flex',
            gap: '20px',
            padding: '20px',
            alignItems: 'flex-start'
        }}>

            <div style={{flex: '0 0 750px'}}> {}
                <PlayerList
                    players={playersReq.data || []}
                    loading={playersReq.loading}
                    error={playersReq.error}
                />
            </div>

            <div style={{flex: '1'}}> {}
                <StatsBoard
                    data={statsReq.data}
                    playerData={playersReq.data || []}
                    loading={statsReq.loading}
                    error={statsReq.error}
                />
            </div>
        </div>
    );
}

export default Home;