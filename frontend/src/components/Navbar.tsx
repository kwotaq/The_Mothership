import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <h1 className="website-title">osu!grStatistics</h1>
                </div>

                <ul className="navbar-links">
                    <li className="nav-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/statistics">Statistics</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;