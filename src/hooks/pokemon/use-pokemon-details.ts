import { useQuery } from '@tanstack/react-query';

import { getPokemonDetails } from '@/services/pokeApi';

export function usePokemonDetails(idOrName: string | number) {
  const query = useQuery({
    queryKey: ['pokemon', idOrName],
    queryFn: () => getPokemonDetails(idOrName),
    enabled: !!idOrName,
    staleTime: 1000 * 60 * 60, // 1 hora de cache (os dados mudam muito raramente)
  });

  return {
    pokemon: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
