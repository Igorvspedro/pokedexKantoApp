import { SkeletonBox } from '@/components/ui/SkeletonBox';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { StyleSheet, View } from 'react-native';

/**
 * Placeholder visual para um PokemonCard enquanto os dados carregam.
 * Mantém o mesmo layout (flex:1 + aspectRatio 1) para não alterar o grid.
 */
export function PokemonCardSkeleton() {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      {/* Imagem */}
      <SkeletonBox height={90} borderRadius={8} style={styles.image} />
      {/* ID */}
      <SkeletonBox width={40} height={12} borderRadius={4} />
      {/* Nome */}
      <SkeletonBox width={70} height={14} borderRadius={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    borderRadius: Spacing.three,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  image: {
    width: '100%',
  },
});
