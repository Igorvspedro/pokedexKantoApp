import { Image } from 'expo-image';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { PokemonListEntry, usePokemons } from '@/hooks/pokemon/use-pokemons';
import { useTheme } from '@/hooks/use-theme';
import { formatPokemonId, formatPokemonName, getOfficialArtworkUrl } from '@/utils/pokemon';

const NUM_COLUMNS = 2;

// ─── Componente de item da lista (será extraído em Etapa 7) ───────────────────

function PokemonListItem({ item }: { item: PokemonListEntry }) {
  const theme = useTheme();
  const artworkUrl = getOfficialArtworkUrl(item.id);

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <Image
        source={{ uri: artworkUrl }}
        style={styles.pokemonImage}
        contentFit="contain"
        transition={200}
      />
      <Text style={[styles.pokemonId, { color: theme.textSecondary }]}>
        {formatPokemonId(item.id)}
      </Text>
      <Text style={[styles.pokemonName, { color: theme.text }]} numberOfLines={1}>
        {formatPokemonName(item.name)}
      </Text>
    </View>
  );
}

// ─── Rodapé da lista ──────────────────────────────────────────────────────────

function ListFooter({ isFetchingNextPage }: { isFetchingNextPage: boolean }) {
  if (!isFetchingNextPage) return null;
  return (
    <View style={styles.footer}>
      <ActivityIndicator size="small" color={Colors.light.textSecondary} />
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function PokedexScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { pokemons, isLoading, isFetchingNextPage, error, hasNextPage, fetchNextPage, refetch } =
    usePokemons();

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
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => String(item.id)}
        numColumns={NUM_COLUMNS}
        renderItem={({ item }) => <PokemonListItem item={item} />}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.four },
        ]}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={<ListFooter isFetchingNextPage={isFetchingNextPage} />}
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
  // Card (será movido para PokemonCard na Etapa 7)
  card: {
    flex: 1,
    alignItems: 'center',
    borderRadius: Spacing.three,
    padding: Spacing.two,
    marginBottom: Spacing.two,
    gap: Spacing.one,
  },
  pokemonImage: {
    width: '100%',
    aspectRatio: 1,
  },
  pokemonId: {
    fontSize: 12,
    fontWeight: '500',
  },
  pokemonName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Estados
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
});
