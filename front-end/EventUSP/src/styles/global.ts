import { StyleSheet } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export const colors = {
  backgroundDark: '#231F20',
  backgroundLight: '#FFFFFF',
  backgroundDarkSecondary: '#262324',
  backgroundLightSecondary: '#A8A8A8',
  textPrimaryDark: '#FFFFFF',
  textPrimaryLight: '#231F20',
  textSecondary: '#929699',
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
    color: "#fcb827",
    fontFamily: "Montserrat_700Bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 30,
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
  },
});