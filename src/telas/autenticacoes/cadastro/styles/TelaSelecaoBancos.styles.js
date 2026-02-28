import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  instrucao: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  bankItem: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  bankIconWrapperSelected: {
    borderColor: '#6BA7FF',
    backgroundColor: 'rgba(107, 167, 255, 0.15)',
  },
  bankIconText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bankName: {
    fontSize: 11,
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
    numberOfLines: 2,
  },
  linkAdicionar: {
    marginBottom: 24,
  },
  linkAdicionarText: {
    fontSize: 15,
    color: '#6BA7FF',
    textDecorationLine: 'underline',
  },
  saveButton: {
    backgroundColor: '#6BA7FF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  mensagemErro: {
    marginTop: 12,
    fontSize: 14,
    color: '#C62828',
  },
});
