import { useInfiniteQuery } from '@tanstack/react-query';

import { getPokemonList } from '@/services/pokeApi';
import { PokemonListItem } from '@/types/pokemon';
import { getPokemonIdFromUrl } from '@/utils/pokemon';

const PAGE_SIZE = 20;

// ─── Tipo auxiliar retornado pelo hook ────────────────────────────────────────

export interface PokemonListEntry extends PokemonListItem {
  id: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePokemons() {
  const query = useInfiniteQuery({
    queryKey: ['pokemons'],
    queryFn: ({ pageParam }) => getPokemonList(PAGE_SIZE, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      // A API retorna null quando não há mais páginas
      if (!lastPage.next) return undefined;
      return lastPageParam + PAGE_SIZE;
    },
  });

  // Achata todas as páginas já carregadas em um array único com id injetado
  const pokemons: PokemonListEntry[] = (query.data?.pages ?? []).flatMap((page) =>
    page.results.map((item) => ({
      ...item,
      id: getPokemonIdFromUrl(item.url),
    }))
  );

  return {
    /** Lista já achatada com todos os Pokémon carregados até agora */
    pokemons,
    /** Total de Pokémon na PokéAPI (da última página recebida) */
    totalCount: query.data?.pages[0]?.count ?? 0,
    /** true enquanto a primeira página está carregando */
    isLoading: query.isLoading,
    /** true quando está buscando mais páginas (não a primeira) */
    isFetchingNextPage: query.isFetchingNextPage,
    /** true quando está em qualquer estado de fetch */
    isFetching: query.isFetching,
    /** Erro, se houver */
    error: query.error,
    /** true se houver mais páginas a carregar */
    hasNextPage: query.hasNextPage,
    /** Função para carregar a próxima página */
    fetchNextPage: query.fetchNextPage,
    /** Reexecuta a query (para uso em botão de retry) */
    refetch: query.refetch,
  };
}
