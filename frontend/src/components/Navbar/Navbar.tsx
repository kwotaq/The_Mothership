import { Link } from "react-router-dom";
import styles from './Navbar.module.css';

export const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContainer}>
                <div className={styles.navbarBrand}>
                    <h1 className={styles.websiteTitle}>The_Mothership</h1>
                </div>

                <ul className={styles.navbarLinks}>
                    <li>
                        <Link to="/" className={styles.navLink}>
                            Player_Statistics
                        </Link>
                    </li>
                    <li>
                        <Link to="/scores" className={styles.navLink}>
                            Score_Statistics
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};