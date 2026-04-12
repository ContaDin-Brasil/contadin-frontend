import { StyleSheet } from 'react-native';
import { COLORS } from '../../../styles/colors';
import { FOOTER_HEIGHT } from '../../../componentes/BotoesAcaoFixo';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    marginBottom: FOOTER_HEIGHT,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formContainer: {
    marginTop: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
    color: COLORS.textPrimary,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  labelInline: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  tooltip: {
    backgroundColor: COLORS.tooltipBg,
    borderColor: COLORS.tooltip,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    position: 'relative',
  },
  tooltipSeta: {
    position: 'absolute',
    top: -7,
    right: 12,
    width: 12,
    height: 12,
    backgroundColor: COLORS.tooltipBg,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: COLORS.tooltip,
    transform: [{ rotate: '45deg' }],
  },
  tooltipTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.tooltip,
    marginBottom: 6,
  },
  tooltipTexto: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.tooltipText,
    marginBottom: 2,
  },
  input: {
    backgroundColor: COLORS.border,
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  inputRow: {
    position: 'relative',
  },
  inputComIcone: {
    paddingRight: 52,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
  validacaoContainer: {
    marginTop: 10,
    marginBottom: 4,
    gap: 6,
  },
  validacaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  validacaoTexto: {
    fontSize: 13,
  },
  validacaoTextoOk: {
    color: '#1B7A3D',
  },
  validacaoTextoErro: {
    fontSize: 13,
    color: '#E53935',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#6BA7FF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 28,
  },
  saveButtonDisabled: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  mensagemErro: {
    color: '#E53935',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});
