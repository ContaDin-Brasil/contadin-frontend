import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#B8DBFF',
    borderWidth: 4,
    borderColor: '#4A9EFF',
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
    borderColor: '#333',
    marginBottom: 5,
  },
  avatarBody: {
    width: 45,
    height: 35,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderWidth: 2,
    borderColor: '#333',
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
    color: '#666',
  },
});
