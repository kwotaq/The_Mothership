// hooks/useData.ts
import {useQuery} from '@tanstack/react-query';

export function useData<T>(
    queryKey: unknown[],
    fetchFunction: () => Promise<T>
) {
    const {
        data,
        isPending,
        isFetching,
        error,
        refetch
    } = useQuery<T, Error>({
        queryKey,
        queryFn: fetchFunction,
    });

    return {
        data: data,
        loading: isPending,
        isFetching,
        error: error?.message ?? null,
        refetch
    };
}