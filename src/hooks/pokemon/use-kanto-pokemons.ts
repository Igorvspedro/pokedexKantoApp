import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useFilters } from '@/contexts/FilterContext';
import { fetcher } from '@/services/pokeApi/client';
import { Endpoints } from '@/services/pokeApi/endpoints';
import { getPokemonIdFromUrl } from '@/utils/pokemon';
import { PokemonListEntry } from './use-pokemons';

interface TypeEndpointResponse {
  pokemon: { pokemon: { name: string; url: string } }[];
}

interface PokemonListResponse {
  results: { name: string; url: string }[];
}

export function useKantoPokemons(searchTerm: string) {
  const { selectedType, selectedClassification } = useFilters();
  const term = searchTerm.trim().toLowerCase();

  // ── Buscar 151 Base ──
  const baseQuery = useQuery({
    queryKey: ['pokemons', 'kanto'],
    // 151 equivale aos Pokémons originais de Kanto
    queryFn: () => fetcher<PokemonListResponse>(`${Endpoints.pokemonList}?limit=151`),
    staleTime: Infinity,
  });

  // ── Buscar lista de determinado tipo (para cruzar os dados) ──
  const typeQuery = useQuery({
    queryKey: ['type', selectedType],
    queryFn: () => fetcher<TypeEndpointResponse>(`${Endpoints.type}/${selectedType}`),
    enabled: !!selectedType,
    staleTime: Infinity,
  });

  const pokemons: PokemonListEntry[] = useMemo(() => {
    if (!baseQuery.data) return [];

    let list = baseQuery.data.results.map((item) => ({
      ...item,
      id: getPokemonIdFromUrl(item.url),
    }));

    // 1. Filtrar pelo Tipo
    if (selectedType && typeQuery.data) {
      const typeNames = new Set(typeQuery.data.pokemon.map((p) => p.pokemon.name));
      list = list.filter((p) => typeNames.has(p.name));
    }

    // 2. Filtrar por Classificação Kanto
    if (selectedClassification !== 'todos') {
      const lendariosIds = [144, 145, 146, 150, 151];
      const pseudoIds = [147, 148, 149];

      list = list.filter((p) => {
        if (selectedClassification === 'lendario') return lendariosIds.includes(p.id);
        if (selectedClassification === 'pseudo') return pseudoIds.includes(p.id);
        if (selectedClassification === 'comum')
          return !lendariosIds.includes(p.id) && !pseudoIds.includes(p.id);
        return true;
      });
    }

    // 3. Busca por Nome ou ID
    if (term.length > 0) {
      list = list.filter((item) => item.name.includes(term) || String(item.id) === term);
    }

    return list;
  }, [baseQuery.data, typeQuery.data, selectedType, selectedClassification, term]);

  return {
    pokemons,
    isLoading: baseQuery.isLoading || typeQuery.isFetching, // isFetching bloqueia a listagem rápida enquanto muda o filtro de aba
    error: baseQuery.error || typeQuery.error,
    refetch: baseQuery.refetch,
  };
}
