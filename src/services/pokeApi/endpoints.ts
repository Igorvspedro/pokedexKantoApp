export const BASE_URL = 'https://pokeapi.co/api/v2';

export const Endpoints = {
  getPokemons: (limit: number, offset: number) =>
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  getPokemonDetails: (idOrName: string | number) => `${BASE_URL}/pokemon/${idOrName}`,
};
