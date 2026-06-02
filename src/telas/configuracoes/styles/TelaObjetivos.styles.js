import { StyleSheet } from 'react-native';
import { getColorsByTheme } from '../../../styles/colors';

export const getStyles = (isDarkMode) => {
  const COLORS = getColorsByTheme(isDarkMode);

  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  recomendacaoCard: {
    backgroundColor: COLORS.secondaryLighter,
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.secondaryBorder,
  },
  recomendacaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recomendacaoEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  recomendacaoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recomendacaoText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  kpiFiltroContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  kpiFiltroBotao: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
  },
  kpiFiltroBotaoAtivo: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  kpiFiltroTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  kpiFiltroTextoAtivo: {
    color: COLORS.white,
  },
  kpiContainer: {
    gap: 12,
    marginBottom: 20,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  kpiCardHalf: {
    flex: 1,
  },
  kpiCardWide: {
    paddingVertical: 18,
  },
  kpiHeader: {
    position: 'relative',
    paddingRight: 28,
    marginBottom: 8,
    minHeight: 24,
  },
  kpiIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  kpiLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'none',
    letterSpacing: 0.3,
    lineHeight: 14,
    flexShrink: 1,
    minWidth: 0,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  kpiValueWide: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  clearSearchButton: {
    padding: 4,
    marginLeft: 8,
  },
  filtrosContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  filtroBotao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
  },
  filtroBotaoAtivo: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filtroTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filtroTextoAtivo: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  objetivosList: {
    gap: 14,
    marginBottom: 22,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  retryButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  retryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  objetivoCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  objetivoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  tipoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tipoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  objetivoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  objetivoCategoria: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  objetivoPrazo: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 6,
  },
  valoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  valorItem: {
    flex: 1,
  },
  valorLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  valorValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  progressoLinha: {
    marginTop: 14,
  },
  progressoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  progressoValor: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  progressoBarra: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressoFill: {
    height: '100%',
    borderRadius: 999,
  },
  insightContainer: {
    marginTop: 14,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 12,
  },
  insightLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  insightText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  objetivoFooter: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  objetivoFooterText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  secondaryButton: {
    backgroundColor: COLORS.primaryLighter,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  });
};

export const styles = getStyles(false);
