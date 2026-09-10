/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const PokemonRed = '#E3350D';
export const PokemonRedDark = '#C12D0B';

export const Colors = {
  light: {
    text: '#1A1A2E',
    background: '#F4F4F8',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#FDECEA',
    textSecondary: '#7B7FA6',
    border: '#E0E0F0',
    accent: PokemonRed,
  },
  dark: {
    text: '#F0F0FF',
    background: '#0F0F1A',
    backgroundElement: '#1C1C2E',
    backgroundSelected: '#2A1F2E',
    textSecondary: '#8080AA',
    border: '#2A2A40',
    accent: PokemonRed,
  },
};

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

// ─── Design Tokens Cartoon ────────────────────────────────────────────────────
export const CartoonBorder = {
  width: 2.5, // borda bold estilo quadrinhos
  widthThick: 3.5, // borda de destaque (cards, badges)
  radius: 16, // arredondamento standard
  radiusLarge: 24, // arredondamento grande (cards, modais)
  radiusRound: 999, // pílula (tipo badges)
  color: 'rgba(0,0,0,0.08)', // borda sutil no light
  colorDark: 'rgba(255,255,255,0.06)', // borda sutil no dark
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
