import { StyleSheet, Text, View } from 'react-native';

import { CartoonBorder, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PokemonStatSlot, PokemonTypeName } from '@/types/pokemon';
import { getPokemonTypeColor } from '@/utils/pokemon-colors';

interface PokemonStatsProps {
  stats: PokemonStatSlot[];
  primaryType: PokemonTypeName | string;
}

const STAT_MAX = 255;

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP.ATK',
  'special-defense': 'SP.DEF',
  speed: 'SPD',
};

export function PokemonStats({ stats, primaryType }: PokemonStatsProps) {
  const theme = useTheme();
  const barColor = getPokemonTypeColor(primaryType);

  return (
    <View style={styles.container}>
      {stats.map((s) => {
        const value = s.base_stat;
        const percentage = Math.min((value / STAT_MAX) * 100, 100);
        const labelText = STAT_LABELS[s.stat.name] ?? s.stat.name.toUpperCase();

        // Cor da barra varia com intensidade do stat
        const barAlpha = 0.5 + (percentage / 100) * 0.5;

        return (
          <View key={s.stat.name} style={styles.row}>
            {/* Label compacto */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              {labelText}
            </Text>

            {/* Valor numérico */}
            <Text style={[styles.value, { color: theme.text }]}>
              {String(value).padStart(3, '0')}
            </Text>

            {/* Trilho da barra */}
            <View style={[styles.barTrack, { backgroundColor: theme.border ?? theme.backgroundElement }]}>
              {/* Preenchimento */}
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${percentage}%` as any,
                    backgroundColor: barColor,
                    opacity: barAlpha,
                  },
                ]}
              />
              {/* Segmentos decorativos cartoon */}
              {[25, 50, 75].map((tick) => (
                <View
                  key={tick}
                  style={[
                    styles.tick,
                    { left: `${tick}%` as any, backgroundColor: theme.background },
                  ]}
                />
              ))}
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
    gap: Spacing.two,
  },
  label: {
    width: 60,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  value: {
    width: 36,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: CartoonBorder.radiusRound,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  barFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: CartoonBorder.radiusRound,
  },
  tick: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1.5,
    opacity: 0.4,
  },
});
