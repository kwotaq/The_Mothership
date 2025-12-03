import {Route, Routes} from "react-router-dom";
import Navbar from './components/Navbar';
import React from "react";
import Home from "./pages/Home.tsx";

const App: React.FC = () => {


    return (
        <div className="app">
            <Navbar/>
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home/>}/>

                </Routes>
            </main>
        </div>
    );
};

export default App;