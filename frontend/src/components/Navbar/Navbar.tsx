import { Link } from "react-router-dom";
import styles from './Navbar.module.css';

export const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContainer}>
                <div className={styles.navbarBrand}>
                    <h1 className={styles.websiteTitle}>osu!grStatistics</h1>
                </div>

                <ul className={styles.navbarLinks}>
                    <li>
                        <Link to="/" className={styles.navLink}>
                            Player Statistics
                        </Link>
                    </li>
                    <li>
                        <Link to="/statistics" className={styles.navLink}>
                            Score Statistics
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};