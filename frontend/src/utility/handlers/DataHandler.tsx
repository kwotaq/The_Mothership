import { type ReactNode } from "react";

interface DataProps {
    data: any;
    loading: boolean;
    error: string | null;
    label: string;
    children: ReactNode;
}

export const DataHandler = ({ loading, error, data, children, label = "Data" }: DataProps) => {
    let content: ReactNode = null;

    if (loading) {
        content = (
            <div className="loading-state">
                <div className="spinner"></div>
                <p className="text-default">Loading {label}...</p>
            </div>
        );
    } else if (error) {
        content = (
            <div className="error-state">
                <h3 className="text-default">Failed to Load {label}</h3>
                <p className="text-muted">{error}</p>
            </div>
        );
    } else if (!data || (Array.isArray(data) && data.length === 0)) {
        content = (
            <div className="empty-state">
                <h3>No {label} Found</h3>
                <p className="text-muted">There are no {label.toLowerCase()} to display.</p>
            </div>
        );
    }

    if (content) {
        return (
            <div className="py-8 px-4 mx-auto w-full">
                {content}
            </div>
        );
    }

    return <>{children}</>;
};