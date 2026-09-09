// ─── Primitivos da API ───────────────────────────────────────────────────────

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface NamedAPIResourceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

// ─── Sprites ─────────────────────────────────────────────────────────────────

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  other: {
    dream_world: {
      front_default: string | null;
      front_female: string | null;
    };
    home: {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
    'official-artwork': {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface PokemonTypeSlot {
  slot: number;
  type: NamedAPIResource;
}

// Nomes de tipos da Pokédex (facilita tipagem dos componentes visuais)
export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

// ─── Habilidades ─────────────────────────────────────────────────────────────

export interface PokemonAbilitySlot {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

// ─── Estatísticas ────────────────────────────────────────────────────────────

export interface PokemonStatSlot {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

// Nomes de stats conhecidos (facilita tradução nos componentes)
export type PokemonStatName =
  'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';

// ─── Movimentos ──────────────────────────────────────────────────────────────

export interface PokemonMoveSlot {
  move: NamedAPIResource;
}

// ─── Pokémon (detalhes) ───────────────────────────────────────────────────────

/** Resposta completa retornada por GET /api/v2/pokemon/:id */
export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  /** Em decímetros — dividir por 10 para obter metros */
  height: number;
  /** Em hectogramas — dividir por 10 para obter kg */
  weight: number;
  is_default: boolean;
  order: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  abilities: PokemonAbilitySlot[];
  stats: PokemonStatSlot[];
  moves: PokemonMoveSlot[];
  species: NamedAPIResource;
}

// ─── Item da lista ────────────────────────────────────────────────────────────

/** Item retornado dentro de `results` na listagem de Pokémon */
export interface PokemonListItem {
  name: string;
  url: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extrai o id numérico a partir da URL do item da lista */
export function extractIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, '').split('/');
  return Number(parts[parts.length - 1]);
}
