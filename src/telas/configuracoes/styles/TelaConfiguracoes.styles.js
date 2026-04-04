import { StyleSheet } from 'react-native';
import { COLORS } from '../../../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLighter,
    borderWidth: 4,
    borderColor: COLORS.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarIcon: {
    alignItems: 'center',
  },
  avatarHead: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    marginBottom: 5,
  },
  avatarBody: {
    width: 45,
    height: 35,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    borderBottomWidth: 0,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  logoutContainer: {
    marginTop: 10,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
