import { useEffect, useState } from 'react';

/**
 * Exibe um estado de "carregando" por um curto período sempre que `dependencyKey` muda.
 * O flag "true" é ajustado durante a renderização (não dentro do efeito) para evitar
 * re-renders em cascata; o efeito apenas agenda o retorno para "false" após o delay.
 */
export function useDebouncedLoading<T>(dependencyKey: T, delay = 400): boolean {
  const [trackedKey, setTrackedKey] = useState(dependencyKey);
  const [isLoading, setIsLoading] = useState(true);

  if (dependencyKey !== trackedKey) {
    setTrackedKey(dependencyKey);
    setIsLoading(true);
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [dependencyKey, delay]);

  return isLoading;
}
