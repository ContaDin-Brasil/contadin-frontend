import { StyleSheet } from 'react-native';
import { COLORS } from '../../../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  /* Listagem */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  /* Loading */
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
  },

  /* Card de Recorrência */
  recorrenciaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  recorrenciaCardHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recorrenciaContent: {
    flex: 1,
    marginRight: 12,
  },
  recorrenciaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
    justifyContent: 'space-between',
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tipoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeAtivo: {
    backgroundColor: '#E7F5ED',
  },
  statusBadgeInativo: {
    backgroundColor: '#FDE7E7',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadgeTextoAtivo: {
    color: '#51CF66',
  },
  statusBadgeTextoInativo: {
    color: '#E31C23',
  },
  recorrenciaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  recorrenciaDetails: {
    marginTop: 12,
  },
  detalheLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detalheLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    minWidth: 80,
  },
  detalheValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  recorrenciaValor: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  recorrenciaValorGasto: {
    color: '#E31C23',
  },
  recorrenciaValorReceita: {
    color: '#51CF66',
  },

  /* Botões de Ação */
  acoesBotoes: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoAcao: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoEditar: {
    backgroundColor: '#F0F7FF',
  },
  boraoDeletar: {
    backgroundColor: '#FDE7E7',
  },

  /* Form - Campos */
  formContainer: {
    marginTop: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.textPrimary,
  },
  inputFocused: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#5BA3FF',
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#E31C23',
  },
  errorText: {
    fontSize: 12,
    color: '#E31C23',
    marginTop: 4,
    marginBottom: 12,
  },

  /* Radio / Picker */
  radioGroup: {
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  radioOptionSelected: {
    backgroundColor: '#F0F7FF',
    borderWidth: 2,
    borderColor: '#5BA3FF',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#5BA3FF',
    backgroundColor: '#5BA3FF',
  },
  radioInnerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  radioDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  /* Data */
  datePicker: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },

  /* Botões de Ação - Form */
  botaoSalvar: {
    backgroundColor: '#5BA3FF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 24,
  },
  botaoSalvarDisabled: {
    opacity: 0.6,
  },
  botaoSalvarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 16,
  },

  /* Filtros */
  filtrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    justifyContent: 'center',
  },
  filtroButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filtroButtonAtivo: {
    backgroundColor: '#5BA3FF',
    borderColor: '#5BA3FF',
  },
  filtroButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  filtroButtonTextoAtivo: {
    color: '#FFFFFF',
  },

  /* Modal de Confirmação */
  modalContent: {
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 12,
    lineHeight: 22,
  },
  modalWarning: {
    fontSize: 14,
    color: '#E31C23',
    fontWeight: '500',
    marginTop: 8,
  },
});
