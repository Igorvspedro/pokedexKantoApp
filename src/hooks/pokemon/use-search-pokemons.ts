import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getAllPokemonList } from '@/services/pokeApi';
import { getPokemonIdFromUrl } from '@/utils/pokemon';
import { PokemonListEntry } from './use-pokemons';

export function useSearchPokemons(queryParam: string) {
  const term = queryParam.trim().toLowerCase();

  const query = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: getAllPokemonList,
    // Só habilitado se tem termo ativo (evita requests vazios)
    enabled: term.length > 0,
    staleTime: Infinity, // Os 1302 nomes não mudam na mesma sessão
  });

  const filteredItems: PokemonListEntry[] = useMemo(() => {
    if (!query.data || term.length === 0) return [];

    // Otimização e injeção do ID
    const allItems = query.data.results.map((item) => ({
      ...item,
      id: getPokemonIdFromUrl(item.url),
    }));

    return allItems.filter((item) => item.name.includes(term) || String(item.id) === term);
  }, [query.data, term]);

  return {
    pokemons: filteredItems,
    isLoading: query.isFetching, // isFetching mostra loading pro usuário em qquer request
    error: query.error,
  };
}
