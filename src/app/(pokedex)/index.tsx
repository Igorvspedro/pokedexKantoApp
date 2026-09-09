import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { Spacing } from '@/constants/theme';
import { PokemonListEntry, usePokemons } from '@/hooks/pokemon/use-pokemons';
import { useSearchPokemons } from '@/hooks/pokemon/use-search-pokemons';
import { useDebounce } from '@/hooks/use-debounce';
import { useTheme } from '@/hooks/use-theme';

const NUM_COLUMNS = 2;

// ─── Rodapé da lista ──────────────────────────────────────────────────────────

interface ListFooterProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  total: number;
  isSearching: boolean;
}

function ListFooter({ isFetchingNextPage, hasNextPage, total, isSearching }: ListFooterProps) {
  const theme = useTheme();

  if (isSearching) return null; // Não há "próxima página" na pesquisa que já carrega todos logotipados

  if (isFetchingNextPage) {
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.textSecondary} />
      </View>
    );
  }

  if (!hasNextPage && total > 0) {
    return (
      <View style={styles.footer}>
        <Text style={[styles.endText, { color: theme.textSecondary }]}>
          Todos os {total} Pokémon carregados ✓
        </Text>
      </View>
    );
  }

  return null;
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function PokedexScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // ── Pesquisa ──
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedTerm = useDebounce(searchTerm, 400);
  const isSearching = debouncedTerm.length > 0;

  // ── Hooks de dados ──
  const listQuery = usePokemons();
  const searchQuery = useSearchPokemons(debouncedTerm);

  // Seleciona a fonte de dados com base na pesquisa
  const activePokemons = isSearching ? searchQuery.pokemons : listQuery.pokemons;
  const isLoading = isSearching ? searchQuery.isLoading : listQuery.isLoading;
  const error = isSearching ? searchQuery.error : listQuery.error;
  const refetch = isSearching ? () => { } : listQuery.refetch; // Search é estático depois do primeiro fetch na sessão

  const renderItem = useCallback<ListRenderItem<PokemonListEntry>>(
    ({ item }) => (
      <PokemonCard
        id={item.id}
        name={item.name}
      />
    ),
    []
  );

  const handleEndReached = useCallback(() => {
    if (isSearching) return; // Pesquisa não tem paginação
    if (listQuery.hasNextPage && !listQuery.isFetchingNextPage) {
      listQuery.fetchNextPage();
    }
  }, [isSearching, listQuery]);

  const keyExtractor = useCallback((item: PokemonListEntry) => String(item.id), []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ── Barra de Pesquisa fixa no topo ── */}
      <View style={styles.header}>
        <SearchBar
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Pesquisar por nome ou ID..."
          onClear={() => setSearchTerm('')}
        />
      </View>

      {/* ── Estado: carregando a primeira vez ── */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.textSecondary} />
          <Text style={[styles.stateText, { color: theme.textSecondary }]}>
            {isSearching ? 'Buscando Pokémon...' : 'Carregando Pokémon...'}
          </Text>
        </View>
      ) : error ? (
        /* ── Estado: erro ── */
        <View style={styles.center}>
          <Text style={[styles.stateText, { color: theme.text }]}>
            Ops! Não foi possível carregar.
          </Text>
          <Text style={[styles.stateSubtext, { color: theme.textSecondary }]}>
            {error.message}
          </Text>
          {!isSearching && (
            <Pressable
              onPress={() => refetch()}
              style={({ pressed }) => [
                styles.retryButton,
                { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.retryText, { color: theme.text }]}>Tentar novamente</Text>
            </Pressable>
          )}
        </View>
      ) : (
        /* ── FlatList Principal ── */
        <FlatList
          data={activePokemons}
          keyExtractor={keyExtractor}
          numColumns={NUM_COLUMNS}
          renderItem={renderItem}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.four },
          ]}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          removeClippedSubviews
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListFooterComponent={
            <ListFooter
              isFetchingNextPage={listQuery.isFetchingNextPage}
              hasNextPage={listQuery.hasNextPage}
              total={listQuery.totalCount}
              isSearching={isSearching}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={[styles.stateText, { color: theme.textSecondary }]}>
                {isSearching
                  ? `Nenhum Pokémon "${searchTerm}" encontrado.`
                  : 'Nenhum Pokémon encontrado.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: Spacing.two,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  listContent: {
    padding: Spacing.two,
  },
  columnWrapper: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  stateText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  stateSubtext: {
    fontSize: 13,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    marginTop: Spacing.two,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  endText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
