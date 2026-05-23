import { StyleSheet } from 'react-native';
import { COLORS } from '../../../styles/colors';

export const styles = StyleSheet.create({
  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 16,
    maxHeight: '70%',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  opcaoSelecionada: {
    backgroundColor: COLORS.primaryLighter,
  },
  opcaoTexto: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  opcaoTextoSelecionado: {
    fontWeight: '600',
    color: COLORS.black,
  },
});
