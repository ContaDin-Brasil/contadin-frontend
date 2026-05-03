import { StyleSheet } from 'react-native';
import { COLORS } from '../../../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  periodFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  periodFilterText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearSearchButton: {
    padding: 4,
    marginLeft: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  sortFilter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  sortFilterText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 5,
    position: 'relative',
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateGroup: {
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  transactionItem: {
    backgroundColor: '#FFF',
    borderColor: '#E0E0E0',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionCategory: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    flex: 1,
  },
  transactionHeaderRight: {
    alignItems: 'flex-end',
  },
  transactionDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
    marginBottom: 4,
  },
  transactionBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  transactionBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
  },
  recurrenceBadge: {
    backgroundColor: COLORS.success + '20',
  },
  recurrenceBadgeText: {
    color: COLORS.success,
  },
  transactionBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 0,
  },
  transactionLeft: {
    flex: 1,
    gap: 4,
  },
  institutionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    alignSelf: 'flex-start',
  },
  institutionBadgeIcon: {
    fontSize: 12,
  },
  institutionBadgeLogo: {
    width: 16,
    height: 16,
    objectFit: 'cover',
    borderRadius: 4,
  },
  institutionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'right',
    marginLeft: 12,
  },
  incomeAmount: {
    color: COLORS.success,
  },
  expenseAmount: {
    color: COLORS.error,
  },
  // Estilos do Banner de Instituição Selecionada
  selectedInstitutionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  bannerIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bannerLogoImage: {
    width: 36,
    height: 36,
    objectFit: 'cover',
    borderRadius: 8,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  bannerClose: {
    padding: 4,
  },
  // Estilos do Banner Offline
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF9800',
    gap: 10,
  },
  offlineBannerText: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
  },
  // Indicador de última atualização
  lastUpdateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 5,
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  // Estado vazio (sem transações ou sem resultados de busca)
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyStateButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Loading footer para paginação
  loadingMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingBottom: 40,
    gap: 10,
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#999',
  },
  endOfListContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
  },
  endOfListText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  // Título com Seletor de Visualização
  tituloSeletorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 10,
  },
  tituloSeletor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  // Modal de Visualização
  modalVisualizacao: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  modalOpcoes: {
    gap: 12,
  },
  modalOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    gap: 12,
  },
  modalOpcaoSelecionada: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  modalOpcaoTexto: {
    flex: 1,
    fontSize: 17,
    color: '#666',
    fontWeight: '500',
  },
  modalOpcaoTextoSelecionado: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  // Estilos para Recorrências
  recorrenciaItem: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recorrenciaItemInativa: {
    opacity: 0.75,
    borderColor: COLORS.error + '40',
  },
  recorrenciaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recorrenciaDescricao: {
    flex: 1,
    marginRight: 12,
  },
  recorrenciaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  recorrenciaValor: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  recorrenciaStatusInline: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 12,
    gap: 6,
  },
  recorrenciaStatusInlineText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recorrenciaSecondaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  recorrenciaCategoryBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  recorrenciaCategoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  institutionBadgeSmall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FAFAFA',
    gap: 8,
  },
  institutionBadgeLogoSmall: {
    width: 16,
    height: 16,
    objectFit: 'cover',
    borderRadius: 3,
  },
  institutionBadgeTextSmall: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  recorrenciaThirdRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  recorrenciaFrequencia: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  recorrenciaFrequenciaText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  recorrenciaProximaData: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  recorrenciaProximaDataText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  recorrenciaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  recorrenciaDataFimFooter: {
    fontSize: 13,
    fontWeight: '500',
  },

  /* ================ ESTILOS PARCELADOS ================ */

  parceladoItem: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  parceladoItemConcluido: {
    backgroundColor: '#F8FFF8',
    borderColor: '#C8E6C9',
  },

  parceladoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  parceladoDescricao: {
    flex: 1,
    paddingRight: 12,
  },

  parceladoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  parceladoValor: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  incomeAmount: {
    color: COLORS.success || '#4CAF50',
  },

  expenseAmount: {
    color: COLORS.danger || '#F44336',
  },

  parceladoProgressContainer: {
    marginBottom: 12,
    gap: 8,
  },

  parceladoProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },

  parceladoProgressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },

  parceladoProgressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1976D2',
    textAlign: 'right',
  },

  parceladoSecondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },

  parceladoCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  parceladoCategoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },

  institutionBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1.5,
    flex: 1,
    minWidth: 100,
  },

  institutionBadgeLogoSmall: {
    width: 16,
    height: 16,
  },

  institutionBadgeIcon: {
    fontSize: 14,
  },

  institutionBadgeTextSmall: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },

  parceladoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  parceladoFooterConcluido: {
    backgroundColor: '#F1F8E9',
    borderColor: '#AED581',
  },

  parceladoFooterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    flex: 1,
  },
});