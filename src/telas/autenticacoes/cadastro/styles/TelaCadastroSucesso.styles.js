import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconeSucesso: {
    marginBottom: 24,
  },
  textoSucesso: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 48,
  },
  botaoContinuar: {
    backgroundColor: '#6BA7FF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoContinuarText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});
