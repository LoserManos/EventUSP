import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundDark,
          borderTopColor: colors.backgroundDarkSecondary,
        },
        tabBarActiveTintColor: colors.orangePrimary,
        tabBarInactiveTintColor: colors.orangeSecondary,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: 'Busca',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='search' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='map'
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name='compass' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='social'
        options={{
          title: 'Social',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='person' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='create-event'
        options={{
          title: 'Criar Evento',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='add-circle' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
