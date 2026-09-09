import { useWindowDimensions } from 'react-native';

/**
 * Breakpoints simples baseados na largura da janela.
 *
 * | Largura        | Colunas |
 * |----------------|---------|
 * | < 600 px       | 2       |  (phone portrait)
 * | 600 – 900 px   | 3       |  (tablet portrait / phone landscape)
 * | > 900 px       | 4       |  (tablet landscape / web)
 */
export function useColumns(): number {
  const { width } = useWindowDimensions();

  if (width >= 900) return 4;
  if (width >= 600) return 3;
  return 2;
}

/** True quando a largura de tela sugere tablet ou desktop */
export function useIsWide(): boolean {
  const { width } = useWindowDimensions();
  return width >= 600;
}
