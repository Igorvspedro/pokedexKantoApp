import { useEffect, useState } from 'react';

/**
 * Hook para adicionar "delay" na atualização de um valor.
 * Muito útil para evitar disparar buscas ao digitar a cada tecla.
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
