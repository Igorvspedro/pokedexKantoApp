import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClassSelectModal } from '@/components/filters/ClassSelectModal';
import { RegionSelectModal } from '@/components/filters/RegionSelectModal';
import { TypeSelectModal } from '@/components/filters/TypeSelectModal';
import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [classModalVisible, setClassModalVisible] = useState(false);

  const insets = useSafeAreaInsets();

  // No Android com botões virtuais clássicos, o insets.bottom reflete a altura deles
  // Somamos o padding fixo (8) ao inset de segurança se existir (no iOS e Android).
  const paddingB = Platform.OS === 'android' ? Math.max(8, insets.bottom) : insets.bottom || 8;
  const tabHeight = 60 + paddingB - 8; // Altura base (60) + o padding ajustado

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.backgroundElement,
            elevation: 0,
            height: tabHeight,
            paddingBottom: paddingB,
          },
          tabBarActiveTintColor: '#E3350D',
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      >
        {/* Mantém a rota principal viva no router, mas sem aparecer como botão The UX will rely on filters instead of a Home button */}
        <Tabs.Screen
          name="(pokedex)"
          options={{
            href: null, // Remove visualmente da Tab Bar!
          }}
        />

        {/* Fake Screen para o botão Regiões */}
        <Tabs.Screen
          name="filtro-regiao"
          options={{
            title: 'Regiões',
            tabBarIcon: ({ color }) => <Ionicons name="globe-outline" color={color} size={24} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setRegionModalVisible(true);
            },
          }}
        />

        {/* Fake Screen para o botão Tipos */}
        <Tabs.Screen
          name="filtro-tipo"
          options={{
            title: 'Tipos',
            tabBarIcon: ({ color }) => <Ionicons name="pricetag-outline" color={color} size={24} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setTypeModalVisible(true);
            },
          }}
        />

        {/* Fake Screen para o botão Classificação */}
        <Tabs.Screen
          name="filtro-classificacao"
          options={{
            title: 'Classificação',
            tabBarIcon: ({ color }) => <Ionicons name="star-outline" color={color} size={24} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setClassModalVisible(true);
            },
          }}
        />
      </Tabs>

      {/* Renderiza os Modais no nível Root atrelados à TabBar */}
      <RegionSelectModal
        visible={regionModalVisible}
        onClose={() => setRegionModalVisible(false)}
      />
      <TypeSelectModal
        visible={typeModalVisible}
        onClose={() => setTypeModalVisible(false)}
      />
      <ClassSelectModal
        visible={classModalVisible}
        onClose={() => setClassModalVisible(false)}
      />
    </>
  );
}
