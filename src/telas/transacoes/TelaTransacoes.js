import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGerenciarTransacoes } from './hooks/useGerenciarTransacoes';
import { 
  formatCurrency, 
  formatDateLabel, 
  groupTransactionsByDate,
  getCategoryIcon
} from './utils/utilitariosTransacao';
import { styles } from './styles/TelaTransacoes.styles';

const TelaTransacoes = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const gerenciador = useGerenciarTransacoes();

  // Mostra loading
  if (gerenciador.loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8A05BE" />
        <Text style={{ marginTop: 16, color: '#666' }}>Carregando transações...</Text>
      </View>
    );
  }

  // Mostra erro
  if (gerenciador.error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Ionicons name="alert-circle-outline" size={64} color="#E31C23" />
        <Text style={{ marginTop: 16, color: '#E31C23', textAlign: 'center' }}>{gerenciador.error}</Text>
        <TouchableOpacity 
          style={[styles.filterButton, { marginTop: 20, paddingHorizontal: 20 }]}
          onPress={gerenciador.carregarDados}
        >
          <Ionicons name="refresh" size={20} color="#666" />
          <Text style={styles.filterButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const groupedTransactions = groupTransactionsByDate(gerenciador.transacoes);

  const renderTransactionItem = (item) => {
    const category = gerenciador.buscarCategoria(item.fk_categoria);
    const institution = gerenciador.buscarInstituicao(item.fk_instituicao);
    const categoryName = category?.nome || 'Sem categoria';
    const institutionName = institution?.nome || 'Sem instituição';
    
    return (
      <TouchableOpacity key={item.id} style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <Ionicons name={getCategoryIcon(categoryName)} size={24} color="#333" />
        </View>
        <View style={styles.transactionInfo}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionCategory}>{categoryName}</Text>
            {item.tipo === 'GASTO' && (
              <View style={styles.categoryBadge}>
                <Ionicons name="repeat" size={10} color="#E31C23" />
                <Text style={styles.categoryBadgeText}>{institutionName}</Text>
              </View>
            )}
          </View>
          <Text style={styles.transactionDescription}>{item.descricao}</Text>
        </View>
        <Text style={[
          styles.transactionAmount,
          item.tipo === 'RECEITA' ? styles.incomeAmount : styles.expenseAmount
        ]}>
          {formatCurrency(item.valor)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transações</Text>

      {/* Filtro de Período */}
      <TouchableOpacity style={styles.periodFilter}>
        <Ionicons name="calendar-outline" size={20} color="#666" />
        <Text style={styles.periodFilterText}>{gerenciador.periodo}</Text>
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
          <Text style={styles.sortFilterText}>{gerenciador.ordenacao}</Text>
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

export default TelaTransacoes;
