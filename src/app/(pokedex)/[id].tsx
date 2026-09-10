import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PokemonDetailsSkeleton } from '@/components/pokemon/PokemonDetailsSkeleton';
import { PokemonStats } from '@/components/pokemon/PokemonStats';
import { PokemonTypeBadge } from '@/components/pokemon/PokemonTypeBadge';
import { CartoonBorder, PokemonRed, Spacing } from '@/constants/theme';
import { usePokemonDetails } from '@/hooks/pokemon/use-pokemon-details';
import { useIsWide } from '@/hooks/use-columns';
import { useTheme } from '@/hooks/use-theme';
import {
  formatHeight,
  formatPokemonId,
  formatPokemonName,
  formatWeight,
  getOfficialArtworkUrl,
} from '@/utils/pokemon';
import { getPokemonTypeColor } from '@/utils/pokemon-colors';

export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isWide = useIsWide();

  const { pokemon, isLoading, error, refetch } = usePokemonDetails(id as string);

  if (isLoading) {
    return <PokemonDetailsSkeleton />;
  }

  if (error || !pokemon) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.stateText, { color: theme.text }]}>Ops! Algo deu errado.</Text>
        <Text style={[styles.stateSubtext, { color: theme.textSecondary }]}>
          {error?.message || 'Dados não encontrados'}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={[styles.retryButton, { backgroundColor: PokemonRed }]}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const artworkUrl = getOfficialArtworkUrl(pokemon.id);
  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const typeColor = getPokemonTypeColor(primaryType);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.four }}
    >
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: typeColor },
          headerTintColor: '#FFFFFF',
          headerTitle: formatPokemonName(pokemon.name),
          headerShadowVisible: false,
        }}
      />

      {/* ── Corpo: stacked (mobile) ou side-by-side (tablet/web) ── */}
      <View style={[styles.body, isWide && styles.bodyWide]}>

        {/* ── Hero: fundo com cor do tipo + artwork ── */}
        <View style={[styles.heroContainer, { backgroundColor: typeColor }, isWide && styles.heroContainerWide]}>
          {/* Círculos decorativos (estilo arte de trainer card anime) */}
          <View style={[styles.deco, styles.decoTopLeft, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />
          <View style={[styles.deco, styles.decoBottomRight, { backgroundColor: 'rgba(255,255,255,0.06)' }]} />

          <Text style={styles.heroId}>{formatPokemonId(pokemon.id)}</Text>
          <Image
            source={{ uri: artworkUrl }}
            style={styles.heroImage}
            contentFit="contain"
            transition={300}
          />
        </View>

        {/* ── Card de Conteúdo ── */}
        <View style={[styles.contentCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }, isWide && styles.contentCardWide]}>

          {/* Nome + Tipos */}
          <View style={styles.nameSection}>
            <Text style={[styles.pokemonName, { color: theme.text }]}>
              {formatPokemonName(pokemon.name)}
            </Text>
            <View style={styles.typeRow}>
              {pokemon.types.map((t) => (
                <PokemonTypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </View>
          </View>

          {/* Divisor */}
          <View style={[styles.divider, { backgroundColor: theme.border ?? theme.backgroundElement }]} />

          {/* Medidas */}
          <View style={styles.measureRow}>
            <View style={[styles.measureCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.measureLabel, { color: theme.textSecondary }]}>⚖️ Peso</Text>
              <Text style={[styles.measureValue, { color: theme.text }]}>
                {formatWeight(pokemon.weight)}
              </Text>
            </View>
            <View style={[styles.measureCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.measureLabel, { color: theme.textSecondary }]}>📏 Altura</Text>
              <Text style={[styles.measureValue, { color: theme.text }]}>
                {formatHeight(pokemon.height)}
              </Text>
            </View>
          </View>

          {/* Habilidades */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: PokemonRed }]}>⚡ Habilidades</Text>
            <View style={styles.abilitiesRow}>
              {pokemon.abilities.map((a) => (
                <View key={a.ability.name} style={[styles.abilityChip, { backgroundColor: theme.background, borderColor: theme.border }]}>
                  <Text style={[styles.abilityText, { color: theme.text }]}>
                    {formatPokemonName(a.ability.name)}
                  </Text>
                  {a.is_hidden && (
                    <Text style={[styles.hiddenTag, { color: theme.textSecondary }]}>oculta</Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: PokemonRed }]}>📊 Estatísticas</Text>
            <PokemonStats stats={pokemon.stats} primaryType={primaryType} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  // ── Layout ──
  body: { flexDirection: 'column' },
  bodyWide: { flexDirection: 'row', alignItems: 'flex-start' },

  // ── Hero ──
  heroContainer: {
    width: '100%',
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: Spacing.four,
    paddingTop: Spacing.four,
    overflow: 'hidden',
    position: 'relative',
  },
  heroContainerWide: {
    width: '40%',
    minHeight: 380,
  },
  heroId: {
    position: 'absolute',
    top: Spacing.three,
    right: Spacing.three,
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  heroImage: {
    width: 200,
    height: 200,
  },
  deco: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  decoTopLeft: { top: -40, left: -40 },
  decoBottomRight: { bottom: -30, right: -30 },

  // ── Content Card ──
  contentCard: {
    margin: Spacing.three,
    borderRadius: CartoonBorder.radiusLarge,
    borderWidth: CartoonBorder.width,
    padding: Spacing.three,
    gap: Spacing.three,
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  contentCardWide: { flex: 1 },

  // ── Nome + Tipos ──
  nameSection: { alignItems: 'center', gap: Spacing.two },
  pokemonName: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  typeRow: { flexDirection: 'row', gap: Spacing.two },
  divider: { height: 1.5, width: '100%', borderRadius: 1 },

  // ── Medidas ──
  measureRow: { flexDirection: 'row', gap: Spacing.two },
  measureCard: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: CartoonBorder.radius,
    borderWidth: CartoonBorder.width,
    alignItems: 'center',
    gap: 4,
  },
  measureLabel: { fontSize: 12, fontWeight: '600' },
  measureValue: { fontSize: 16, fontWeight: '800' },

  // ── Seção genérica ──
  section: { gap: Spacing.two },
  sectionTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },

  // ── Habilidades ──
  abilitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  abilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: CartoonBorder.radiusRound,
    borderWidth: CartoonBorder.width,
  },
  abilityText: { fontSize: 13, fontWeight: '700' },
  hiddenTag: { fontSize: 10, fontWeight: '500', fontStyle: 'italic' },

  // ── Estados ──
  stateText: { fontSize: 18, fontWeight: '700' },
  stateSubtext: { fontSize: 14, textAlign: 'center' },
  retryButton: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: CartoonBorder.radiusRound,
  },
  retryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
