import PlayerList from "../components/PlayerList.tsx";
import {useData} from "../hooks/useData.ts";
import api from "../api.tsx";

const fetchPlayers = () =>
  api.get('/api/player_info_list').then(res => res.data);

function Home() {
  const { data: players, loading, error} = useData(fetchPlayers);

  return <div><PlayerList players={players || []} loading={loading} error={error} /></div>;
}

export default Home;