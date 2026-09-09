import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPokemonId, formatPokemonName, getOfficialArtworkUrl } from '@/utils/pokemon';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PokemonCardProps {
  id: number;
  name: string;
  /** Chamado ao tocar no card — será usado na Etapa 10 para navegar aos detalhes */
  onPress?: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function PokemonCard({ id, name, onPress }: PokemonCardProps) {
  const theme = useTheme();
  const artworkUrl = getOfficialArtworkUrl(id);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.85 : 1 },
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${formatPokemonName(name)}, número ${id}`}
    >
      <Image
        source={{ uri: artworkUrl }}
        style={styles.image}
        contentFit="contain"
        transition={200}
        // Fallback vazio enquanto a imagem não carrega
        placeholder={{ uri: undefined }}
      />

      <View style={styles.info}>
        <Text style={[styles.idText, { color: theme.textSecondary }]}>
          {formatPokemonId(id)}
        </Text>
        <Text style={[styles.nameText, { color: theme.text }]} numberOfLines={1}>
          {formatPokemonName(name)}
        </Text>
      </View>
    </Pressable>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

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
    aspectRatio: 1,
  },
  info: {
    alignItems: 'center',
    gap: 2,
    paddingBottom: Spacing.one,
  },
  idText: {
    fontSize: 12,
    fontWeight: '500',
  },
  nameText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
