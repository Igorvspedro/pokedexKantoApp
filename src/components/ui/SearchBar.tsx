import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { CartoonBorder, PokemonRed, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Pesquisar...',
  onClear,
}: SearchBarProps) {
  const theme = useTheme();
  const hasFocus = value.length > 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: hasFocus ? PokemonRed : theme.border,
        },
      ]}
    >
      <Ionicons
        name="search"
        size={18}
        color={hasFocus ? PokemonRed : theme.textSecondary}
      />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && onClear && (
        <Pressable onPress={onClear} hitSlop={10}>
          <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderRadius: CartoonBorder.radiusRound,
    borderWidth: CartoonBorder.width,
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
    fontWeight: '500',
  },
});
