import { useCallback } from 'react';
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
import { Spacing } from '@/constants/theme';
import { PokemonListEntry, usePokemons } from '@/hooks/pokemon/use-pokemons';
import { useTheme } from '@/hooks/use-theme';

const NUM_COLUMNS = 2;

// ─── Rodapé da lista ──────────────────────────────────────────────────────────

interface ListFooterProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  total: number;
}

function ListFooter({ isFetchingNextPage, hasNextPage, total }: ListFooterProps) {
  const theme = useTheme();

  if (isFetchingNextPage) {
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.textSecondary} />
      </View>
    );
  }

  // Mostra "fim da lista" somente quando todos os Pokémon foram carregados
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
  const {
    pokemons,
    totalCount,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePokemons();

  // useCallback evita recriar a função a cada render da tela
  const renderItem = useCallback<ListRenderItem<PokemonListEntry>>(
    ({ item }) => (
      <PokemonCard
        id={item.id}
        name={item.name}
      // onPress será conectado à navegação na Etapa 10
      />
    ),
    []
  );

  const handleEndReached = useCallback(() => {
    // Dupla proteção: hasNextPage E não estar já buscando
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const keyExtractor = useCallback((item: PokemonListEntry) => String(item.id), []);

  // ── Estado: carregando a primeira página ──
  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.textSecondary} />
        <Text style={[styles.stateText, { color: theme.textSecondary }]}>
          Carregando Pokémon...
        </Text>
      </View>
    );
  }

  // ── Estado: erro ──
  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.stateText, { color: theme.text }]}>
          Ops! Não foi possível carregar os Pokémon.
        </Text>
        <Text style={[styles.stateSubtext, { color: theme.textSecondary }]}>{error.message}</Text>
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={pokemons}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        renderItem={renderItem}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.four },
        ]}
        // ── Infinite scroll ──
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        // ── Performance ──
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        // ── Footer e empty ──
        ListFooterComponent={
          <ListFooter
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            total={totalCount}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={[styles.stateText, { color: theme.textSecondary }]}>
              Nenhum Pokémon encontrado.
            </Text>
          </View>
        }
      />
    </View>
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
