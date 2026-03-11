import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
    const { pathname } = useLocation();

    return (
        <nav className="sticky top-0 z-[1000] active:bg-[var(--bg-primary)] border-b border-[var(--alien-primary)] backdrop-blur-[15px]">
            <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
                <h1 className="text-[var(--alien-primary)] font-mono text-3xl font-bold uppercase [text-shadow:0_0_10px_var(--alien-glow)]">
                    The_Mothership
                </h1>

                <ul className="flex items-center gap-2 list-none">
                    <li>
                        <Link to="/" className={`nav-link ${pathname === '/' ? 'nav-link-active' : ''}`}>
                            Player_Statistics
                        </Link>
                    </li>
                    <li>
                        <Link to="/scores" className={`nav-link ${pathname === '/scores' ? 'nav-link-active' : ''}`}>
                            Score_Statistics
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};