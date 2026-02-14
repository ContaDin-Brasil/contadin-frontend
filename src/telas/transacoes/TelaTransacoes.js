import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TelaTransacoes = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('Período Completo');
  const [sortFilter, setSortFilter] = useState('Mais recentes');

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      category: 'Alimentação',
      categoryIcon: 'restaurant',
      description: 'Salário Avanade',
      amount: -60.59,
      date: new Date(),
      type: 'expense',
      institution: 'Santander'
    },
    {
      id: 2,
      category: 'Alimentação',
      categoryIcon: 'restaurant',
      description: 'Descrição',
      amount: -60.59,
      date: new Date(),
      type: 'expense',
      institution: 'Santander'
    },
    {
      id: 3,
      category: 'Categoria',
      categoryIcon: 'briefcase',
      description: 'Descrição',
      amount: 200,
      date: new Date(),
      type: 'income',
      institution: 'Nubank'
    },
    {
      id: 4,
      category: 'Alimentação',
      categoryIcon: 'restaurant',
      description: 'Descrição',
      amount: -60.59,
      date: new Date('2026-02-04'),
      type: 'expense',
      institution: 'Itaú'
    },
    {
      id: 5,
      category: 'Categoria',
      categoryIcon: 'briefcase',
      description: 'Descrição',
      amount: 200,
      date: new Date('2026-02-04'),
      type: 'income',
      institution: 'Flash'
    },
    {
      id: 6,
      category: 'Alimentação',
      categoryIcon: 'restaurant',
      description: 'Descrição',
      amount: -60.59,
      date: new Date('2026-02-04'),
      type: 'expense',
      institution: 'Santander'
    },
    {
      id: 7,
      category: 'Categoria',
      categoryIcon: 'briefcase',
      description: 'Descrição',
      amount: 200,
      date: new Date('2026-02-04'),
      type: 'income',
      institution: 'Alelo'
    },
  ]);

  const groupTransactionsByDate = () => {
    const grouped = {};
    transactions.forEach(transaction => {
      const dateKey = transaction.date.toLocaleDateString('pt-BR');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });
    return grouped;
  };

  const formatCurrency = (value) => {
    const formatted = Math.abs(value).toFixed(2).replace('.', ',');
    return value >= 0 ? `+R$ ${formatted}` : `-R$ ${formatted}`;
  };

  const formatDateLabel = (dateString) => {
    const today = new Date().toLocaleDateString('pt-BR');
    if (dateString === today) {
      return 'Hoje';
    }
    return dateString.split('/')[0] + ' ' + getMonthName(dateString);
  };

  const getMonthName = (dateString) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const month = parseInt(dateString.split('/')[1]) - 1;
    return months[month] + ', ' + dateString.split('/')[2];
  };

  const groupedTransactions = groupTransactionsByDate();

  const renderTransactionItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Ionicons name={item.categoryIcon} size={24} color="#333" />
      </View>
      <View style={styles.transactionInfo}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          {item.type === 'expense' && (
            <View style={styles.categoryBadge}>
              <Ionicons name="repeat" size={10} color="#E31C23" />
              <Text style={styles.categoryBadgeText}>{item.institution}</Text>
            </View>
          )}
        </View>
        <Text style={styles.transactionDescription}>{item.description}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        item.type === 'income' ? styles.incomeAmount : styles.expenseAmount
      ]}>
        {formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transações</Text>

      {/* Filtro de Período */}
      <TouchableOpacity style={styles.periodFilter}>
        <Ionicons name="calendar-outline" size={20} color="#666" />
        <Text style={styles.periodFilterText}>{periodFilter}</Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      {/* Campo de Pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Procurar transações..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtros */}
      <View style={styles.filtersRow}>
        <TouchableOpacity style={styles.sortFilter}>
          <Text style={styles.sortFilterText}>{sortFilter}</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={18} color="#666" />
          <Text style={styles.filterButtonText}>Filtros</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Transações */}
      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedTransactions).map(([date, transactions]) => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateLabel}>{formatDateLabel(date)}</Text>
            {transactions.map(transaction => renderTransactionItem(transaction))}
          </View>
        ))}
      </ScrollView>

      {/* Botão Flutuante */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AdicionarTransacao')}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
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
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
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
    color: '#333',
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
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  sortFilterText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 5,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
  transactionInfo: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#E31C23',
    fontWeight: '500',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#00C853',
  },
  expenseAmount: {
    color: '#E31C23',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default TelaTransacoes;
