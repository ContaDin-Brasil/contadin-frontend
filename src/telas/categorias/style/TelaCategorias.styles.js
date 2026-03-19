import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerHandleSearchExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom:10,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  searchButton: {
    padding: 4,
    paddingRight: 20,
  },
  searchIconExpanded: {
    marginRight: 10,
  },
  searchInputExpanded: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  typeToggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#B8DBFF',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  categoriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoriaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoriaIcone: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriaNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  categoriaBadge: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    fontWeight: '400',
  },
  categoriaActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#E53935',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});
