import { Stack } from 'expo-router';
import { colors } from '@/styles/global';

export default function SocialLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false ,
        headerTintColor: colors.textPrimaryDark,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}