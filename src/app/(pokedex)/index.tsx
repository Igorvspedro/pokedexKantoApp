import { Stack, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { PokemonCardSkeleton } from '@/components/pokemon/PokemonCardSkeleton';
import { SearchBar } from '@/components/ui/SearchBar';
import { Spacing } from '@/constants/theme';
import { REGIONS, useFilters } from '@/contexts/FilterContext';
import { PokemonListEntry } from '@/hooks/pokemon/use-pokemons';
import { useRegionPokemons } from '@/hooks/pokemon/use-region-pokemons';
import { useColumns } from '@/hooks/use-columns';
import { useDebounce } from '@/hooks/use-debounce';
import { useTheme } from '@/hooks/use-theme';

export default function PokedexScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const numColumns = useColumns();
  const router = useRouter();
  const { selectedRegion } = useFilters();

  // ── Pesquisa ──
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedTerm = useDebounce(searchTerm, 400);

  // ── Hook de dados (Região selecionada + filtros in-memory) ──
  const { pokemons, isLoading, error, refetch } = useRegionPokemons(debouncedTerm);

  // Título dinâmico do header reflete a região atual
  const regionLabel = REGIONS[selectedRegion].label;

  const renderItem = useCallback<ListRenderItem<PokemonListEntry>>(
    ({ item }) => (
      <PokemonCard
        id={item.id}
        name={item.name}
        onPress={() => router.push(`/(pokedex)/${item.id}` as any)}
      />
    ),
    []
  );

  const keyExtractor = useCallback((item: PokemonListEntry) => String(item.id), []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: '#E3350D' },
          headerTintColor: '#FFFFFF',
          headerTitle: `Pokédex — ${regionLabel}`,
          headerLargeTitle: false,
          headerShadowVisible: false,
        }}
      />

      {/* ── Barra de Pesquisa fixa no topo ── */}
      <View style={styles.header}>
        <SearchBar
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Pesquisar por nome ou ID..."
          onClear={() => setSearchTerm('')}
        />
      </View>

      {/* ── Estado: carregando ── */}
      {isLoading ? (
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={styles.skeletonCell}>
              <PokemonCardSkeleton />
            </View>
          ))}
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.stateText, { color: theme.text }]}>
            Ops! Não foi possível carregar.
          </Text>
          <Text style={[styles.stateSubtext, { color: theme.textSecondary }]}>
            {error.message}
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
      ) : (
        <FlatList
          key={numColumns}
          data={pokemons}
          keyExtractor={keyExtractor}
          numColumns={numColumns}
          renderItem={renderItem}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.six },
          ]}
          initialNumToRender={18}
          maxToRenderPerBatch={18}
          windowSize={7}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={[styles.stateText, { color: theme.textSecondary }]}>
                Nenhum Pokémon encontrado.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.four,
    paddingTop: Spacing.two,
  },
  listContent: {
    paddingHorizontal: Spacing.two,
  },
  columnWrapper: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.two,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  stateText: {
    fontSize: 18,
    fontWeight: '500',
  },
  stateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.two,
  },
  skeletonCell: {
    width: '50%',
    padding: Spacing.one,
    marginBottom: Spacing.two,
  },
});
