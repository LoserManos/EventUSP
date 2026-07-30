// src/app/create/_layout.tsx
import { Stack } from 'expo-router';
import { colors } from '@/styles/global';

export default function CreateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false ,
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
        options={{ title: 'Criar Evento' }} 
      />
      <Stack.Screen 
        name="create-org" 
        options={{ title: 'Criar Organização' }} 
      />
    </Stack>
  );
}