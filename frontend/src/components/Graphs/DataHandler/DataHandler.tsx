import React, {type ReactNode} from "react";

interface DataProps {
    data: any;
    loading: boolean;
    error: string | null;
    label: string;
    children: ReactNode;
}

const DataHandler: React.FC<DataProps> = ({
                                              loading,
                                              error,
                                              data,
                                              children,
                                              label = "Data"
                                          }) => {
    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p className="text-gold">Loading {label}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state">
                <h3 className="text-gold">Failed to Load {label}</h3>
                <p className="text-muted">{error}</p>
            </div>
        );
    }

    const isEmpty = !data || (Array.isArray(data) && data.length === 0);

    if (isEmpty) {
        return (
            <div className="empty-state">
                <h3>No {label} Found</h3>
                <p className="text-muted">There are no {label.toLowerCase()} to display.</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default DataHandler;