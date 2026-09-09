import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Detalhes do Pokémon: {id} (em breve)</Text>
    </View>
  );
}
