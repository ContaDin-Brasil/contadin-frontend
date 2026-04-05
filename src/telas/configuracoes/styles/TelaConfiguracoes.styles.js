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

  /* Seções */
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  /* Items de Configuração */
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  /* Divisor */
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 16,
  },

  /* Botão de Logout */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFEBEB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFD6D6',
    gap: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E31C23',
  },

  /* Modal */
  modalText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  modalContent: {
    marginVertical: 10,
  },
  bulletPoint: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 12,
    lineHeight: 20,
  },
  modalQuestion: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 10,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: COLORS.border,
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 8,
  },
});
