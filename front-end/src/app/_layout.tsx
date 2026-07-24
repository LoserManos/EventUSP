import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

// 1. Importe o AuthProvider e o hook useAuth do seu contexto
import { AuthProvider, useAuth } from "../contexts/AuthContext"; 

// Componente interno que decide para onde o usuário deve ir
function MainLayout() {
  const { isLogged, loading } = useAuth();
  const segments = useSegments(); // Pega a pasta/rota atual que o usuário está
  const router = useRouter();

  useEffect(() => {
    // 2. Se a aplicação ainda está verificando o token, não fazemos nada.
    if (loading) return;

    // 'segments' diz em qual grupo de rotas estamos. ex: ["(auth)", "login"]
    const inAuthGroup = segments[0] === '(auth)';

    if (!isLogged && !inAuthGroup) {
      // 3. Se não tem usuário logado e não está na tela de Auth, joga pro Login
      router.replace('/(auth)/login');
    } else if (isLogged && inAuthGroup) {
      // 4. Se tem usuário logado e ele tenta abrir a tela de Login, joga pras Tabs
      router.replace('/(tabs)');
    }
  }, [isLogged, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

// Layout Raiz Exportado
export default function RootLayout() {
  const [loaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!loaded) {
    return null;
  }

  // 2. Envelopamos o MainLayout com o AuthProvider
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}