export const BASE_URL = 'https://pokeapi.co/api/v2';

export const Endpoints = {
  pokemonList: `${BASE_URL}/pokemon`,
  type: `${BASE_URL}/type`,
  getPokemons: (limit: number, offset: number) =>
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  getPokemonDetails: (idOrName: string | number) => `${BASE_URL}/pokemon/${idOrName}`,
};
