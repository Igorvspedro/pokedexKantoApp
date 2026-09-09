import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SkeletonBox } from '@/components/ui/SkeletonBox';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Skeleton da tela de detalhes do Pokémon.
 * Replica o layout de [id].tsx em estado de carregamento.
 */
export function PokemonDetailsSkeleton() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.four }}
      scrollEnabled={false}
    >
      {/* Imagem hero */}
      <View style={[styles.imageContainer, { backgroundColor: theme.backgroundElement }]}>
        <SkeletonBox width={200} height={200} borderRadius={100} />
      </View>

      <View style={styles.content}>
        {/* ID + Nome */}
        <View style={styles.header}>
          <SkeletonBox width={50} height={16} borderRadius={4} />
          <SkeletonBox width={160} height={28} borderRadius={6} />
        </View>

        {/* Tipos */}
        <View style={styles.section}>
          <SkeletonBox width={50} height={12} borderRadius={4} />
          <View style={styles.row}>
            <SkeletonBox width={70} height={28} borderRadius={14} />
            <SkeletonBox width={70} height={28} borderRadius={14} />
          </View>
        </View>

        {/* Peso + Altura */}
        <View style={styles.rowCentered}>
          <View style={[styles.infoCard, { backgroundColor: theme.backgroundElement }]}>
            <SkeletonBox width={40} height={12} borderRadius={4} />
            <SkeletonBox width={60} height={20} borderRadius={4} />
          </View>
          <View style={[styles.infoCard, { backgroundColor: theme.backgroundElement }]}>
            <SkeletonBox width={40} height={12} borderRadius={4} />
            <SkeletonBox width={60} height={20} borderRadius={4} />
          </View>
        </View>

        {/* Habilidades */}
        <View style={styles.section}>
          <SkeletonBox width={80} height={12} borderRadius={4} />
          <SkeletonBox width={120} height={16} borderRadius={4} />
          <SkeletonBox width={100} height={16} borderRadius={4} />
        </View>

        {/* Stats — 6 barras */}
        <View style={styles.section}>
          <SkeletonBox width={120} height={12} borderRadius={4} />
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.statRow}>
              <SkeletonBox width={140} height={14} borderRadius={4} />
              <SkeletonBox height={6} borderRadius={3} style={{ flex: 1 }} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    aspectRatio: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: Spacing.five,
    borderBottomRightRadius: Spacing.five,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  section: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  rowCentered: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: 4,
  },
  statRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
  },
});
