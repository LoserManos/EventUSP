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
  redWarning: "#EF4444",
  shadow: 'rgb(0, 0, 0)'
};

export const fonts = {
    font: ''
}

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    paddingTop: 40,
    paddingHorizontal: 20,
    fontFamily: "Montserrat_400Regular",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16
  },
  itemsList: {
    paddingBottom: 10,
    boxShadow: colors.shadow
  },

  centered: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  title: {
    fontSize: 24,
    color: colors.textPrimaryDark,
    fontWeight: 'bold',
    fontFamily: "Montserrat_700Bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimaryDark,
    marginBottom: 16,
    fontFamily: "Montserrat_400Regular",
  },
  label: { 
    color: colors.textSecondary, 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  primaryText: {
    color: colors.textPrimaryDark, 
    fontSize: 16, 
    fontWeight: 'bold'
  },
  secondaryText:{
    color: colors.textSecondary, 
    fontSize: 12
  },
  counterText:{
    color: colors.bluePrimary, 
    fontSize: 14,
    fontWeight: 'bold'
  },
  empty: {
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },

  input: { 
    backgroundColor: colors.backgroundDarkSecondary, 
    borderWidth: 1, 
    borderColor: colors.backgroundDarkSecondary, 
    borderRadius: 8, 
    padding: 8, 
    color: colors.textPrimaryDark, 
    fontSize: 12 
  },

  iconButton: { 
    padding: 6,
    borderRadius: 6, 
    borderWidth: 1, 
  },
  iconsTab: {
    flexDirection: 'row',
    gap: 8 
  },

  profileHeader: {
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    gap: 16, 
    marginVertical: 16
  },
  profilePicture: {
    width: 96, 
    height: 96, 
    borderRadius: 8
  },
  profileDescription: {
    color: colors.textPrimaryDark, 
    fontSize: 12,
  },

  socialItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    borderRadius: 8,
    margin: 4,
    padding: 8,
    elevation: 8,
    boxShadow: colors.shadow
  },
  buttonsTab : {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    gap: 10,
  },
  interactionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  blueInteractionButton: {
    backgroundColor: colors.bluePrimary,
  },
  orangeInteractionButton: {
    backgroundColor: colors.orangePrimary,
  },
  redInteractionButton: {
    backgroundColor: colors.redWarning,
  },
  pressedInteractionButton: {
    backgroundColor: colors.backgroundDarkSecondary,
  },
  interactionButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  primaryInteractionText: {
    color: '#FFF',
  },
  pressedInteractionText: {
    color: colors.textSecondary,
  },
  itemPicture: { 
    width: 56, 
    height: 56, 
    borderRadius: 8 
  },
  itemInfoContainer: { 
    flex: 1,
    marginHorizontal: 8
  },
  itemName: { 
    color: colors.textPrimaryDark, 
    fontWeight: 'bold' 
  },
  itemSecondaryName: { 
    color: colors.textSecondary, 
  },
  itemDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },

  listPreviewContainer: {
    flexDirection: 'column' , 
    marginVertical: 4, 
    gap: 4
  },
  listPreviewCard: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: colors.backgroundDarkSecondary, 
    borderRadius: 10, 
    padding: 12, 
    borderWidth: 1, 
    borderColor: colors.backgroundDarkSecondary
  },
  listPreviewPictureList: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8
  },
  listPreviewPicture: {
    height:32, 
    width:32, 
    borderRadius:8
  },

  infoForm: {
    gap: 12, 
    paddingBottom: 10
  },
  infoFormImageContainer : {
    alignItems: 'center',
    marginBottom: 8
  },
  formTextArea: { 
    height: 80, 
    textAlignVertical: 'top' 
  },
  formSaveButton: { 
    backgroundColor: colors.bluePrimary, 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 8 
  },
  formSaveButtonText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 12 
  },
});