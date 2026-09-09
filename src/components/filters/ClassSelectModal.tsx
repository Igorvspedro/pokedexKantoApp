import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ClassificationType, useFilters } from '@/contexts/FilterContext';
import { useTheme } from '@/hooks/use-theme';
import { SymbolView } from 'expo-symbols';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const OPTIONS: { value: ClassificationType; label: string }[] = [
  { value: 'todos', label: 'Todos os Pokémon' },
  { value: 'comum', label: 'Comuns' },
  { value: 'pseudo', label: 'Pseudo-Lendários (Dragões)' },
  { value: 'lendario', label: 'Lendários & Míticos' },
];

export function ClassSelectModal({ visible, onClose }: Props) {
  const theme = useTheme();
  const { selectedClassification, setClassification } = useFilters();

  const handleSelect = (value: ClassificationType) => {
    setClassification(value);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Filtrar por Classificação</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <SymbolView name="xmark" size={24} tintColor={theme.textSecondary} />
            </Pressable>
          </View>

          {OPTIONS.map((opt) => {
            const isSelected = selectedClassification === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={[
                  styles.option,
                  { borderBottomColor: theme.backgroundElement },
                  isSelected && { backgroundColor: theme.backgroundElement },
                ]}
                onPress={() => handleSelect(opt.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isSelected ? '#E3350D' : theme.text },
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
                {isSelected && (
                  <SymbolView name="checkmark" size={20} tintColor="#E3350D" />
                )}
              </Pressable>
            );
          })}
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
    paddingBottom: Spacing.six,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: Spacing.one,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderBottomWidth: 1,
    borderRadius: Spacing.two,
  },
  optionText: {
    fontSize: 16,
  },
  optionTextSelected: {
    fontWeight: 'bold',
  },
});
