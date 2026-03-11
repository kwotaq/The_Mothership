import {Route, Routes} from "react-router-dom";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Navbar} from './pages/Navbar.tsx';
import {PlayerStatistics} from "./pages/PlayerStatistics.tsx";
import {ScoreStatistics} from "./pages/ScoreStatistics.tsx";
import {PlayerProvider} from "./Utility/PlayerProvider.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
        },
    },
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <PlayerProvider>
                <div className="app">
                    <Navbar/>
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<PlayerStatistics/>}/>
                            <Route path="/scores" element={<ScoreStatistics/>}/>
                        </Routes>
                    </main>
                </div>
                <ReactQueryDevtools initialIsOpen={false}/>
            </PlayerProvider>
        </QueryClientProvider>
    );
};