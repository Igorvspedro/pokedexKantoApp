import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PokemonTypeName } from '@/types/pokemon';
import { getPokemonTypeColor } from '@/utils/pokemon-colors';

interface PokemonTypeBadgeProps {
  type: PokemonTypeName | string;
}

export function PokemonTypeBadge({ type }: PokemonTypeBadgeProps) {
  const theme = useTheme();
  // Se estivermos no modo dark, as vezes as cores bright podem ofuscar, 
  // mas aqui decidimos aplicar direto o hex padrão pra manter identidade clássica.
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
    paddingVertical: Spacing.one,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    // Alguma sombra ou opacidade poderia ir aqui
  },
  text: {
    color: '#FFFFFF', // Texto branco sempre em fundos de tipo por constraste
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
