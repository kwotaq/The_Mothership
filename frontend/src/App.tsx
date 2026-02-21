import { Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from './components/Navbar/Navbar.tsx';
import React from "react";
import PlayerStatistics from "./pages/PlayerStatistics.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="app">
                <Navbar/>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<PlayerStatistics/>}/>
                    </Routes>
                </main>
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;