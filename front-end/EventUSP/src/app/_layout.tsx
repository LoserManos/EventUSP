import { Stack } from "expo-router";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

export default function RootLayout() {
  const [loaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return <Stack />;
}