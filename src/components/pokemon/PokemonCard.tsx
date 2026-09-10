import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CartoonBorder, PokemonRed, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPokemonId, formatPokemonName, getOfficialArtworkUrl } from '@/utils/pokemon';

export interface PokemonCardProps {
  id: number;
  name: string;
  onPress?: () => void;
}

export function PokemonCard({ id, name, onPress }: PokemonCardProps) {
  const theme = useTheme();
  const artworkUrl = getOfficialArtworkUrl(id);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
          transform: [{ scale: pressed ? 0.95 : 1 }],
          shadowColor: PokemonRed,
        },
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${formatPokemonName(name)}, número ${id}`}
    >
      {/* Faixa superior decorativa (cartoon header) */}
      <View style={styles.cardTopAccent} />

      {/* Imagem com fundo circular sutil */}
      <View style={[styles.imageWrapper, { backgroundColor: theme.background }]}>
        <Image
          source={{ uri: artworkUrl }}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />
      </View>

      {/* Rodapé do card */}
      <View style={styles.info}>
        <Text style={[styles.idText, { color: PokemonRed }]}>
          {formatPokemonId(id)}
        </Text>
        <Text style={[styles.nameText, { color: theme.text }]} numberOfLines={1}>
          {formatPokemonName(name)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    borderRadius: CartoonBorder.radiusLarge,
    borderWidth: CartoonBorder.width,
    overflow: 'hidden',
    // Sombra suave (iOS/web)
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    // Android elevation
    elevation: 6,
  },
  cardTopAccent: {
    width: '100%',
    height: 4,
    backgroundColor: PokemonRed,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    padding: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  info: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    gap: 2,
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  nameText: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
