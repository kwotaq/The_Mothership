import type {FallbackProps} from 'react-error-boundary';

export const ErrorFallback = ({ error }: FallbackProps) => {
    const err = error as Error;

    return (
        <div className="error-card">
            <p>{err.message || "Unknown Error"}</p>
        </div>
    );
};