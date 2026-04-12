import { StyleSheet } from 'react-native';
import { COLORS } from '../../../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
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
    backgroundColor: COLORS.white,
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
    color: COLORS.black,
    fontWeight: '600',
  },
  content: {
    marginTop: 20,
  },
  contactItem: {
    backgroundColor: COLORS.white,
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
  },
  expandedContent: {
    backgroundColor: COLORS.white,
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
    color: COLORS.tooltip,
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
    backgroundColor: '#FFF',
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
    color: '#000',
  },
  channelRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  channelValue: {
    fontSize: 14,
    color: '#666',
  },
  accordionItem: {
    backgroundColor: '#FFF',
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
    paddingRight: 12,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flexShrink: 1,
  },
  accordionContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  accordionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  placeholderContainer: {
    backgroundColor: '#FFF',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    color: '#000',
  },
  chatAvatarTextUser: {
    color: '#FFF',
  },
  chatBubble: {
    maxWidth: '72%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  chatBubbleBot: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  chatBubbleUser: {
    backgroundColor: COLORS.primary,
  },
  chatText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  chatTextUser: {
    color: '#FFF',
  },
  chatTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  chatTimeUser: {
    color: '#E6EEFF',
  },
  chatComposer: {
    marginVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  chatInput: {
    flex: 1,
    color: '#333',
    fontSize: 14,
    paddingVertical: 0,
  },
  chatComposerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
