import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
    const { pathname } = useLocation();

    return (
        <nav className="sticky top-0 z-[1000] active:bg-[var(--bg-primary)] border-b border-[var(--alien-primary)] backdrop-blur-[15px]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                <h1 className="text-[var(--alien-primary)] font-mono text-2xl sm:text-3xl font-bold uppercase [text-shadow:0_0_10px_var(--alien-glow)]">
                    The_Mothership
                </h1>

                <ul className="flex items-center gap-4 sm:gap-2 list-none">
                    <li>
                        <Link to="/" className={`nav-link text-sm sm:text-base ${pathname === '/' ? 'nav-link-active' : ''}`}>
                            Player_Statistics
                        </Link>
                    </li>
                    <li>
                        <Link to="/scores" className={`nav-link text-sm sm:text-base ${pathname === '/scores' ? 'nav-link-active' : ''}`}>
                            Score_Statistics
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};