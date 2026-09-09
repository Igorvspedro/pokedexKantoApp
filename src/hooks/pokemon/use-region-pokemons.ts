import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { REGIONS, useFilters } from '@/contexts/FilterContext';
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

export function useRegionPokemons(searchTerm: string) {
  const { selectedRegion, selectedType, selectedClassification } = useFilters();
  const term = searchTerm.trim().toLowerCase();

  const regionData = REGIONS[selectedRegion];

  // ── Buscar Pokedex da Região ──
  const baseQuery = useQuery({
    queryKey: ['pokemons', selectedRegion],
    queryFn: () =>
      fetcher<PokemonListResponse>(
        `${Endpoints.pokemonList}?limit=${regionData.limit}&offset=${regionData.offset}`
      ),
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

    // 2. Filtrar por Classificação Kanto/Generals
    if (selectedClassification !== 'todos') {
      // Listas expandidas rudimentares
      // Mythicals & Legendaries gen 1-9 (simplificado):
      // Array simplificado cobrindo principais notáveis por ID:
      const lendariosIds = [
        // Gen 1
        144, 145, 146, 150, 151,
        // Gen 2
        243, 244, 245, 249, 250, 251,
        // Gen 3
        377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
        // Gen 4
        480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
        // Gen 5
        494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
        // Gen 6
        716, 717, 718, 719, 720, 721,
        // Gen 7
        772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800,
        801, 802, 803, 804, 805, 806, 807, 808, 809,
        // Gen 8
        888, 889, 890, 891, 892, 894, 895, 896, 897, 898,
        // Gen 9
        1001, 1002, 1003, 1004, 1007, 1008,
      ];

      const pseudoIds = [
        149, // Dragonite
        248, // Tyranitar
        373, // Salamence
        376, // Metagross
        445, // Garchomp
        635, // Hydreigon
        706, // Goodra
        784, // Kommo-o
        887, // Dragapult
        998, // Baxcalibur
      ];

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
    isLoading: baseQuery.isLoading || typeQuery.isFetching,
    error: baseQuery.error || typeQuery.error,
    refetch: baseQuery.refetch,
  };
}
