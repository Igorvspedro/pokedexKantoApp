import { NamedAPIResourceList } from '@/types/pokemon';
import { fetcher } from './client';
import { Endpoints } from './endpoints';

export async function getPokemonList(limit = 20, offset = 0) {
  const url = Endpoints.getPokemons(limit, offset);
  return fetcher<NamedAPIResourceList>(url);
}
