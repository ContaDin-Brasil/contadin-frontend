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
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 12,
    marginBottom: 24,
  },
  pinInput: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 16,
    borderRadius: 8,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  linkReenviar: {
    marginBottom: 24,
  },
  linkReenviarText: {
    fontSize: 16,
    color: '#6BA7FF',
    textDecorationLine: 'underline',
  },
  linkReenviarDisabled: {
    color: '#999',
  },
  saveButton: {
    backgroundColor: '#6BA7FF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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
