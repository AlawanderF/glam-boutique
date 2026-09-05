import { useState, useEffect, useCallback } from 'react';

interface UseApiOrMockOptions<T> {
  deps?: any[];
  immediate?: boolean;
  mockFallback?: boolean;
}

interface UseApiOrMockReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isFromMock: boolean;
  refresh: () => Promise<void>;
}

export type { UseApiOrMockOptions, UseApiOrMockReturn };

/**
 * Hook unificado: tenta buscar da API, cai no mock se vazio/erro.
 * Centraliza a lógica que estava duplicada em todas as páginas Admin.
 */
export function useApiOrMock<T>(
  fetcher: () => Promise<T>,
  mockData: T,
  options: UseApiOrMockOptions<T> = {}
): UseApiOrMockReturn<T> {
  const { deps = [], immediate = true, mockFallback = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);
  const [isFromMock, setIsFromMock] = useState(false);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (result && (Array.isArray(result) ? result.length > 0 : true)) {
        setData(result);
        setIsFromMock(false);
      } else if (mockFallback) {
        setData(mockData);
        setIsFromMock(true);
      } else {
        setData(result);
        setIsFromMock(false);
      }
    } catch (err) {
      if (mockFallback) {
        setData(mockData);
        setIsFromMock(true);
      }
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetcher, mockData, mockFallback]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, isFromMock, refresh: execute };
}
