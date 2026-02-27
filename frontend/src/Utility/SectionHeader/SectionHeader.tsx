import styles from './SectionHeader.module.css';
import React from "react";

interface Props {
    title: string;
    children?: React.ReactNode; // For things like the "Item Count" or buttons on the right
}

export const SectionHeader = ({ title, children }: Props) => {
    return (
        <header className={styles.listHeader}>
            <h2>{title}</h2>
            {children && <div className={styles.headerActions}>{children}</div>}
        </header>
    );
};