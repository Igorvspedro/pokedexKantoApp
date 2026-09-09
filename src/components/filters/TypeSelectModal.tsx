import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useFilters } from '@/contexts/FilterContext';
import { useTheme } from '@/hooks/use-theme';
import { getPokemonTypeColor } from '@/utils/pokemon-colors';
import { SymbolView } from 'expo-symbols';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const KANTO_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting',
  'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'fairy'
];

export function TypeSelectModal({ visible, onClose }: Props) {
  const theme = useTheme();
  const { selectedType, setType } = useFilters();

  const handleSelect = (val: string | null) => {
    setType(val);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Filtrar por Tipo</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <SymbolView name="xmark" size={24} tintColor={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Pressable
              style={[
                styles.optionBtn,
                { backgroundColor: selectedType === null ? theme.text : theme.backgroundElement },
              ]}
              onPress={() => handleSelect(null)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: selectedType === null ? theme.background : theme.text },
                ]}
              >
                Todos os Tipos
              </Text>
            </Pressable>

            <View style={styles.grid}>
              {KANTO_TYPES.map((type) => {
                const isSelected = selectedType === type;
                const typeColor = getPokemonTypeColor(type);

                return (
                  <Pressable
                    key={type}
                    style={[
                      styles.typeBadge,
                      { backgroundColor: typeColor },
                      isSelected && styles.typeBadgeSelected,
                    ]}
                    onPress={() => handleSelect(type)}
                  >
                    <Text style={styles.typeText}>{type.toUpperCase()}</Text>
                    {isSelected && (
                      <View style={styles.checkIcon}>
                        <SymbolView name="checkmark" size={14} tintColor="#FFFFFF" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    maxHeight: '80%', // scroll view constraints
    paddingVertical: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: Spacing.one,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  optionBtn: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  typeBadge: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeBadgeSelected: {
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  typeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  checkIcon: {
    marginLeft: 4,
  },
});
