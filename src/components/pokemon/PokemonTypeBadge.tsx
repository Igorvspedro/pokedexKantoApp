import { StyleSheet, Text, View } from 'react-native';

import { CartoonBorder, Spacing } from '@/constants/theme';
import { PokemonTypeName } from '@/types/pokemon';
import { getPokemonTypeColor } from '@/utils/pokemon-colors';

interface PokemonTypeBadgeProps {
  type: PokemonTypeName | string;
}

export function PokemonTypeBadge({ type }: PokemonTypeBadgeProps) {
  const backgroundColor = getPokemonTypeColor(type);

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.text}>{type.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: CartoonBorder.radiusRound,
    alignItems: 'center',
    justifyContent: 'center',
    // Borda branca cartoon nos badges de tipo
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
    // Sombra suave do badge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
