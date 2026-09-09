import { PokemonTypeName } from '@/types/pokemon';

/**
 * Retorna uma cor em hexadecimal para representar cada tipo de Pokémon.
 * Cores inspiradas nas tipologias clássicas da série principal.
 */
export function getPokemonTypeColor(type: PokemonTypeName | string): string {
  const map: Record<string, string> = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#8f97f3ff',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#5935fcff',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  };

  return map[type.toLowerCase()] || '#777777'; // Fallback para cinza caso tipo desconhecido
}
