import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PokemonStatSlot, PokemonTypeName } from '@/types/pokemon';
import { getPokemonTypeColor } from '@/utils/pokemon-colors';

interface PokemonStatsProps {
  stats: PokemonStatSlot[];
  primaryType: PokemonTypeName | string;
}

// Em jogos de Pokémon da série principal, o teto real de status base é 255.
const STAT_MAX = 255;

export function PokemonStats({ stats, primaryType }: PokemonStatsProps) {
  const theme = useTheme();
  const barColor = getPokemonTypeColor(primaryType);

  return (
    <View style={styles.container}>
      {stats.map((s) => {
        const value = s.base_stat;
        // Limita a 100% para evitar overflow visual caso algo bizarro retorne na API
        const percentage = Math.min((value / STAT_MAX) * 100, 100);

        // Nomenclatura tratada ("special-attack" -> "SP ATTACK") pra caber bonitozinho
        const labelText = s.stat.name
          .replace('special-attack', 'sp. attack')
          .replace('special-defense', 'sp. defense')
          .toUpperCase();

        return (
          <View key={s.stat.name} style={styles.row}>
            {/* Rótulo e Valor lado esquerdo */}
            <View style={styles.infoCol}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                {labelText}
              </Text>
              <Text style={[styles.value, { color: theme.text }]}>
                {String(value).padStart(3, '0')}
              </Text>
            </View>

            {/* Barra Visual lado direito */}
            <View style={[styles.barBackground, { backgroundColor: theme.backgroundElement }]}>
              <View
                style={[
                  styles.barFill,
                  { width: `${percentage}%`, backgroundColor: barColor },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  infoCol: {
    flexDirection: 'row',
    width: 140, // fixado para alinhar perfeitamente todas as barras
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  barBackground: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
