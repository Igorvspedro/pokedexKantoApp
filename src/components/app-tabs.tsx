import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { useColorScheme } from 'react-native';

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

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.backgroundElement,
            elevation: 0,
            height: 60,
            paddingBottom: 8,
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
            tabBarIcon: ({ color }) => <SymbolView name="globe" tintColor={color} size={24} />,
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
            tabBarIcon: ({ color }) => <SymbolView name="tag.fill" tintColor={color} size={24} />,
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
            tabBarIcon: ({ color }) => <SymbolView name="star.fill" tintColor={color} size={24} />,
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
