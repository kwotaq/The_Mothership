import {type ReactNode} from "react";
import styles from "./DataHandler.module.css"

interface DataProps {
    data: any;
    loading: boolean;
    error: string | null;
    label: string;
    children: ReactNode;
}

export const DataHandler = ({loading, error, data, children, label = "Data"}: DataProps) => {

    if (loading) {
        return (
            <div className={styles.dataContainer}>
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p className="text-gold">Loading {label}...</p>
                </div>
            </div>

        );
    }

    if (error) {
        return (
            <div className={styles.dataContainer}>

                <div className="error-state">
                    <h3 className="text-gold">Failed to Load {label}</h3>
                    <p className="text-muted">{error}</p>
                </div>
            </div>
        );
    }

    const isEmpty = !data || (Array.isArray(data) && data.length === 0);

    if (isEmpty) {
        return (
            <div className={styles.dataContainer}>
                <div className="empty-state">
                    <h3>No {label} Found</h3>
                    <p className="text-muted">There are no {label.toLowerCase()} to display.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};