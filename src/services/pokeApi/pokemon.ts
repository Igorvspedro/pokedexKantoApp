import { NamedAPIResourceList, Pokemon } from '@/types/pokemon';
import { fetcher } from './client';
import { Endpoints } from './endpoints';

export async function getPokemonList(limit = 20, offset = 0) {
  const url = Endpoints.getPokemons(limit, offset);
  return fetcher<NamedAPIResourceList>(url);
}

export async function getPokemonDetails(idOrName: string | number) {
  const url = Endpoints.getPokemonDetails(idOrName);
  return fetcher<Pokemon>(url);
}

export async function getAllPokemonList() {
  const url = Endpoints.getPokemons(10000, 0); // Limit alto para buscar os ~1302 nomes
  return fetcher<NamedAPIResourceList>(url);
}
