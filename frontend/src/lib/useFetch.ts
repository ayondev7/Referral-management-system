import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';

export function useFetch<T>(
  fetcher: () => Promise<{ data: T }>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetcher();
        if (mounted) {
          setData(response.data);
        }
      } catch (err) {
        if (mounted) {
          const axiosError = err as AxiosError<{ message: string }>;
          setError(axiosError.response?.data?.message || 'An error occurred');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [fetcher, ...deps]);

  return { data, loading, error };
}
