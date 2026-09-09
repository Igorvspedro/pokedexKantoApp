import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { REGIONS, RegionType, useFilters } from '@/contexts/FilterContext';
import { useTheme } from '@/hooks/use-theme';
import { SymbolView } from 'expo-symbols';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function RegionSelectModal({ visible, onClose }: Props) {
  const theme = useTheme();
  const { selectedRegion, setRegion } = useFilters();

  const handleSelect = (value: RegionType) => {
    setRegion(value);
    onClose();
  };

  const options = Object.entries(REGIONS) as [RegionType, typeof REGIONS['kanto']][];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Selecione a Região</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <SymbolView name="xmark" size={24} tintColor={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {options.map(([regionKey, data]) => {
              const isSelected = selectedRegion === regionKey;
              return (
                <Pressable
                  key={regionKey}
                  style={[
                    styles.option,
                    { borderBottomColor: theme.backgroundElement },
                    isSelected && { backgroundColor: theme.backgroundElement },
                  ]}
                  onPress={() => handleSelect(regionKey)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? '#E3350D' : theme.text },
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {data.label}
                  </Text>
                  {isSelected && (
                    <SymbolView name="checkmark" size={20} tintColor="#E3350D" />
                  )}
                </Pressable>
              );
            })}
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
    paddingBottom: Spacing.six,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    maxHeight: '80%',
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
  scroll: {
    paddingBottom: Spacing.four,
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
