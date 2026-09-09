import { extractIdFromUrl } from '@/types/pokemon';

// ─── Formatação de ID ─────────────────────────────────────────────────────────

/**
 * Formata o número do Pokémon com zeros à esquerda.
 * Ex: 1 → "#001", 25 → "#025", 151 → "#151"
 */
export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

// ─── Formatação de Nome ───────────────────────────────────────────────────────

/**
 * Capitaliza o primeiro caractere e substitui hífens por espaços.
 * Ex: "bulbasaur" → "Bulbasaur", "mr-mime" → "Mr Mime"
 */
export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ─── Formatação de Medidas ────────────────────────────────────────────────────

/**
 * Converte decímetros em metros.
 * Ex: 7 → "0.7m"
 */
export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)}m`;
}

/**
 * Converte hectogramas em quilogramas.
 * Ex: 69 → "6.9 kg"
 */
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`;
}

// ─── Extração de ID ───────────────────────────────────────────────────────────

/**
 * Retorna o id numérico de um item da lista a partir de sua URL.
 */
export function getPokemonIdFromUrl(url: string): number {
  return extractIdFromUrl(url);
}

// ─── URL do Sprite ────────────────────────────────────────────────────────────

/**
 * Retorna a URL do sprite oficial de um dado id.
 * Usa o official artwork que tem melhor qualidade que o sprite padrão.
 */
export function getOfficialArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
