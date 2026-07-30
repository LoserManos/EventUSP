// src/app/create/_layout.tsx
import { Stack } from 'expo-router';
import { colors } from '@/styles/global';

export default function CreateLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundDark,
        },
        headerTintColor: colors.textPrimaryDark,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ title: 'Criar', headerShown: false }} 
      />
      <Stack.Screen 
        name="create-event" 
        options={{ title: 'Criar Evento', headerTitle: '' }} 
      />
      <Stack.Screen 
        name="create-org" 
        options={{ title: 'Criar Organização', headerTitle: '' }} 
      />
    </Stack>
  );
}