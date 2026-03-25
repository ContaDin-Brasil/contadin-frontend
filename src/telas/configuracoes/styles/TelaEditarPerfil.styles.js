import { StyleSheet } from 'react-native';
import { FOOTER_HEIGHT } from '../../../componentes/BotoesAcaoFixo';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    marginBottom: FOOTER_HEIGHT,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  formContainer: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
    marginBottom: 6,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#D5DFEA',
    marginTop: 26,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#000',
  },
  input: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  impactText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: '#4B5563',
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#6BA7FF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 32,
  },
  saveButtonDisabled: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});
