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
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: 24,
      marginBottom: 20,
      gap: 10,
    },
    seletorIdiomaHeader: {
      marginLeft: 'auto',
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.textPrimary,
      flex: 1,
    },
    body: {
      flex: 1,
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 100,
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: COLORS.backgroundLight,
      borderRadius: 12,
      padding: 4,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 10,
    },
    activeTab: {
      backgroundColor: COLORS.primaryLighter,
    },
    tabText: {
      fontSize: 16,
      color: COLORS.textSecondary,
      fontWeight: '500',
    },
    activeTabText: {
      color: COLORS.textPrimary,
      fontWeight: '600',
    },
    content: {
      marginTop: 20,
    },
    contactItem: {
      backgroundColor: COLORS.backgroundLight,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderRadius: 12,
      marginBottom: 12,
    },
    contactHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    contactTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.textPrimary,
    },
    expandedContent: {
      backgroundColor: COLORS.backgroundLight,
      padding: 20,
      borderRadius: 12,
      marginTop: -8,
      marginBottom: 12,
    },
    contactInfo: {
      fontSize: 16,
      color: COLORS.textPrimary,
    },
    linkButton: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    linkButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: COLORS.primary,
    },
    contactSection: {
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.textPrimary,
      marginBottom: 10,
    },
    channelItem: {
      backgroundColor: COLORS.backgroundLight,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    channelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    channelTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.textPrimary,
    },
    channelRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    channelValue: {
      fontSize: 14,
      color: COLORS.textSecondary,
    },
    accordionItem: {
      backgroundColor: COLORS.backgroundLight,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderRadius: 12,
      marginBottom: 12,
    },
    accordionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      paddingEnd: 12,
    },
    accordionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.textPrimary,
      flexShrink: 1,
    },
    accordionContent: {
      backgroundColor: COLORS.backgroundLight,
      padding: 20,
      borderRadius: 12,
      marginTop: -8,
      marginBottom: 12,
    },
    accordionText: {
      fontSize: 15,
      color: COLORS.textPrimary,
      lineHeight: 20,
    },
    placeholderContainer: {
      backgroundColor: COLORS.backgroundLight,
      padding: 40,
      borderRadius: 12,
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: 18,
      color: COLORS.textSecondary,
    },
    chatTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.textPrimary,
      marginBottom: 12,
    },
    chatList: {
      gap: 12,
    },
    chatContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    chatScroll: {
      flex: 1,
    },
    chatScrollContent: {
      paddingBottom: 16,
    },
    chatRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    chatRowUser: {
      justifyContent: 'flex-end',
    },
    chatRowBot: {
      justifyContent: 'flex-start',
    },
    chatAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 8,
    },
    chatAvatarBot: {
      backgroundColor: COLORS.primaryLighter,
    },
    chatAvatarUser: {
      backgroundColor: COLORS.primary,
    },
    chatAvatarText: {
      fontSize: 11,
      fontWeight: '700',
      color: COLORS.textPrimary,
    },
    chatAvatarTextUser: {
      color: COLORS.white,
    },
    chatBubble: {
      maxWidth: '72%',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 16,
    },
    chatBubbleBot: {
      backgroundColor: COLORS.backgroundLight,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    chatBubbleUser: {
      backgroundColor: COLORS.primary,
    },
    chatText: {
      fontSize: 14,
      color: COLORS.textPrimary,
      lineHeight: 20,
    },
    chatTextUser: {
      color: COLORS.white,
    },
    chatTime: {
      fontSize: 11,
      color: COLORS.textTertiary,
      marginTop: 6,
      alignSelf: 'flex-end',
    },
    chatTimeUser: {
      color: COLORS.primaryLighter,
    },
    chatComposer: {
      marginVertical: 12,
      backgroundColor: COLORS.backgroundLight,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    chatInput: {
      flex: 1,
      color: COLORS.textPrimary,
      fontSize: 14,
      paddingVertical: 0,
    },
    chatComposerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
  });
};

export const styles = getStyles(false);