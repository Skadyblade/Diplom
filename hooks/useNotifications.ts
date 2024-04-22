import useSWR from "swr";

import fetcher from "@/libs/fetcher";

const useNotifications = (useriId?: string) => {
    const url = useriId ? `/api/notifications/${useriId}` : null
    const { 
        data, 
        error, 
        isLoading, 
        mutate 
} = useSWR(url, fetcher);

    return {
        data, 
        error,
        isLoading,
        mutate
    }
};

export default useNotifications;