import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { usePokemonDetails } from '@/hooks/pokemon/use-pokemon-details';
import { useTheme } from '@/hooks/use-theme';
import {
  formatHeight,
  formatPokemonId,
  formatPokemonName,
  formatWeight,
  getOfficialArtworkUrl,
} from '@/utils/pokemon';

export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { pokemon, isLoading, error, refetch } = usePokemonDetails(id as string);

  // ── Estados de Carregamento e Erro ──

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.textSecondary} />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.stateText, { color: theme.text }]}>Não foi possível carregar</Text>
        <Text style={[styles.stateSubtext, { color: theme.textSecondary }]}>
          {error?.message || 'Dados não encontrados'}
        </Text>
        <Pressable
          onPress={() => refetch()}
          style={({ pressed }) => [
            styles.retryButton,
            { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.retryText, { color: theme.text }]}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  // ── Renderização Principal ──

  const artworkUrl = getOfficialArtworkUrl(pokemon.id);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.four }}
    >
      {/* ── Imagem Principal ── */}
      <View style={[styles.imageContainer, { backgroundColor: theme.backgroundElement }]}>
        <Image
          source={{ uri: artworkUrl }}
          style={styles.image}
          contentFit="contain"
          transition={300}
        />
      </View>

      <View style={styles.content}>
        {/* ── Título ── */}
        <View style={styles.header}>
          <Text style={[styles.idText, { color: theme.textSecondary }]}>
            {formatPokemonId(pokemon.id)}
          </Text>
          <Text style={[styles.nameText, { color: theme.text }]}>
            {formatPokemonName(pokemon.name)}
          </Text>
        </View>

        {/* ── Tipos (Básico por enquanto - será melhorado na Etapa 12) ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Tipos</Text>
          <View style={styles.row}>
            {pokemon.types.map((t) => (
              <View key={t.type.name} style={[styles.badge, { backgroundColor: theme.backgroundElement }]}>
                <Text style={{ color: theme.text }}>{t.type.name.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Dimensões ── */}
        <View style={styles.rowCentered}>
          <View style={[styles.infoCard, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Peso</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {formatWeight(pokemon.weight)}
            </Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Altura</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {formatHeight(pokemon.height)}
            </Text>
          </View>
        </View>

        {/* ── Habilidades ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Habilidades</Text>
          {pokemon.abilities.map((a) => (
            <Text key={a.ability.name} style={[styles.abilityText, { color: theme.text }]}>
              • {formatPokemonName(a.ability.name)} {a.is_hidden && '(Oculta)'}
            </Text>
          ))}
        </View>

        {/* ── Estatísticas (Básico - será melhorado na Etapa 13) ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Estatísticas Base</Text>
          {pokemon.stats.map((s) => (
            <View key={s.stat.name} style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                {s.stat.name.toUpperCase()}
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{s.base_stat}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: Spacing.five,
    borderBottomRightRadius: Spacing.five,
    padding: Spacing.four,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  idText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  rowCentered: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  badge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.three,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  abilityText: {
    fontSize: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  stateText: {
    fontSize: 18,
    fontWeight: '500',
  },
  stateSubtext: {
    fontSize: 14,
  },
  retryButton: {
    marginTop: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
