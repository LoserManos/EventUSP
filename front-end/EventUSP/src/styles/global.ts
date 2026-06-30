import { StyleSheet } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export const colors = {
  backgroundDark: '#231F20',
  backgroundLight: '#FFFFFF',
  backgroundDarkSecondary: '#262326',
  backgroundLightSecondary: '#A8A8A8',
  textPrimaryDark: '#dcd0dc',
  textPrimaryLight: '#231F20',
  textSecondary: '#808080',
  bluePrimary:  '#87D4E4',
  blueSecondary: '#CEECF3',
  orangePrimary:  '#FCB928',
  orangeSecondary: '#FEE1B0',
  shadow: 'rgba(0, 0, 0, 0.25)'
};

export const fonts = {
    font: ''
}

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    paddingTop: 60,
    paddingHorizontal: 20,
    fontFamily: "Montserrat_400Regular",
  },
  title: {
    fontSize: 28,
    color: colors.textPrimaryDark,
    fontWeight: 'bold',
    fontFamily: "Montserrat_700Bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimaryDark,
    marginBottom: 16,
    fontFamily: "Montserrat_400Regular",
  },
  empty: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16
  },
});