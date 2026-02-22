import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Image, SafeAreaView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import TituloPagina from '../../componentes/TituloPagina';
import { getLogoByName } from '../../componentes/modais/logosInstituicoes';
import { useGerenciarTransacoes } from './hooks/useGerenciarTransacoes';
import { 
  formatCurrency, 
  formatDateLabel, 
  groupTransactionsByDate,
  getCategoryIcon
} from './utils/utilitariosTransacao';
import { styles } from './styles/TelaTransacoes.styles';

const TelaTransacoes = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const gerenciador = useGerenciarTransacoes();

  // Recebe os dados da instituição clicada (se houver)
  const instituicaoSelecionada = route.params?.instituicao || null;

  // Log para debug (pode remover depois)
  React.useEffect(() => {
    if (instituicaoSelecionada) {
      console.log('📍 Instituição selecionada:', instituicaoSelecionada);
      console.log('   - Nome:', instituicaoSelecionada.nome);
      console.log('   - Tipo:', instituicaoSelecionada.tipo);
      console.log('   - ID:', instituicaoSelecionada.id);
    }
  }, [instituicaoSelecionada]);

  /**
   * Atualiza dados quando a tela recebe foco
   * Detecta mudanças vindas de outras telas (adicionar, editar, deletar)
   */
  useFocusEffect(
    React.useCallback(() => {
      console.log('\n' + '='.repeat(60));
      console.log('🔄 [AUTO-REFRESH] Tela de transações recebeu foco');
      console.log('='.repeat(60));
      console.log('📊 Recarregando dados do banco...');
      
      gerenciador.carregarDados().then(() => {
        setLastUpdate(new Date());
        console.log('✅ Dados atualizados com sucesso!');
        console.log('⏰ Última atualização:', new Date().toLocaleTimeString('pt-BR'));
        console.log('='.repeat(60) + '\n');
      }).catch((err) => {
        console.error('❌ Erro ao atualizar dados:', err);
        console.log('='.repeat(60) + '\n');
      });
    }, [])
  );

  /**
   * Handler para pull-to-refresh manual
   */
  const onRefresh = React.useCallback(async () => {
    console.log('\n' + '='.repeat(60));
    console.log('🔄 [MANUAL-REFRESH] Usuário solicitou atualização');
    console.log('='.repeat(60));
    
    setRefreshing(true);
    try {
      await gerenciador.carregarDados();
      setLastUpdate(new Date());
      console.log('✅ Dados atualizados manualmente com sucesso!');
      console.log('⏰ Última atualização:', new Date().toLocaleTimeString('pt-BR'));
    } catch (err) {
      console.error('❌ Erro ao atualizar:', err);
    } finally {
      setRefreshing(false);
      console.log('='.repeat(60) + '\n');
    }
  }, []);

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

  // Filtra transações pela instituição selecionada (se houver)
  let transacoesExibidas = gerenciador.transacoes;
  if (instituicaoSelecionada) {
    transacoesExibidas = gerenciador.transacoes.filter(
      transacao => transacao.fk_instituicao === instituicaoSelecionada.id
    );
  }

  const groupedTransactions = groupTransactionsByDate(transacoesExibidas);

  const renderTransactionItem = (item) => {
    const category = gerenciador.buscarCategoria(item.fk_categoria);
    const institution = gerenciador.buscarInstituicao(item.fk_instituicao);
    const categoryName = category?.nome || 'Sem categoria';
    const institutionName = institution?.nome || 'Sem instituição';
    const institutionColor = institution?.cor || '#666';
    const institutionIcon = institution?.icone || '📱';
    const institutionLogo = getLogoByName(institutionName);
    const transactionDate = new Date(item.data_transacao).toLocaleDateString('pt-BR');
    
    return (
      <TouchableOpacity key={item.id} style={styles.transactionItem}>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionIcon}>
            <Ionicons name={getCategoryIcon(categoryName)} size={24} color="#333" />
          </View>
          <Text style={styles.transactionCategory}>{categoryName}</Text>
          <Text style={styles.transactionDate}>{transactionDate}</Text>
        </View>
        
        <View style={styles.transactionBody}>
          <View style={styles.transactionLeft}>
            <View style={[styles.institutionBadge, { backgroundColor: institutionLogo ? '#FFF' : institutionColor + '20', borderColor: institutionColor }]}>
              {institutionLogo ? (
                <Image 
                  source={institutionLogo} 
                  style={styles.institutionBadgeLogo}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.institutionBadgeIcon}>{institutionIcon}</Text>
              )}
              <Text style={[styles.institutionBadgeText]}>
                {institutionName}
              </Text>
            </View>
            <Text style={styles.transactionDescription}>{item.descricao}</Text>
          </View>
          
          <Text style={[
            styles.transactionAmount,
            item.tipo === 'RECEITA' ? styles.incomeAmount : styles.expenseAmount
          ]}>
            {formatCurrency(item.tipo === 'RECEITA' ? item.valor : -item.valor)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina>Transações</TituloPagina>

      {/* Banner de Instituição Selecionada */}
      {instituicaoSelecionada && (() => {
        const bannerLogo = getLogoByName(instituicaoSelecionada.nome);
        return (
          <View style={[styles.selectedInstitutionBanner, { backgroundColor: instituicaoSelecionada.cor + '20', borderColor: instituicaoSelecionada.cor }]}>
            <View style={styles.bannerContent}>
              <View style={[styles.bannerIcon, { backgroundColor: bannerLogo ? '#FFF' : instituicaoSelecionada.cor }]}>
                {bannerLogo ? (
                  <Image 
                    source={bannerLogo} 
                    style={styles.bannerLogoImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.bannerIconText}>{instituicaoSelecionada.icone}</Text>
                )}
              </View>
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerTitle}>{instituicaoSelecionada.nome}</Text>
                <Text style={styles.bannerSubtitle}>
                  {instituicaoSelecionada.tipo === 'banco' ? '🏦 Banco' : '🎫 Vale'} • {instituicaoSelecionada.balance}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.bannerClose}
              onPress={() => navigation.setParams({ instituicao: null })}
            >
              <Ionicons name="close-circle" size={24} color={instituicaoSelecionada.cor} />
            </TouchableOpacity>
          </View>
        );
      })()}

      {/* Alerta de Modo Offline */}
      {gerenciador.usandoDadosMockados && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={20} color="#FF9800" />
          <Text style={styles.offlineBannerText}>
            Modo offline - usando dados de exemplo
          </Text>
        </View>
      )}

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

      {/* Indicador de Última Atualização */}
      <View style={styles.lastUpdateContainer}>
        <Ionicons name="time-outline" size={12} color="#999" />
        <Text style={styles.lastUpdateText}>
          Atualizado às {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      {/* Lista de Transações */}
      <ScrollView 
        style={styles.transactionsList} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8A05BE']}
            tintColor="#8A05BE"
            title="Atualizando..."
            titleColor="#666"
          />
        }
      >
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
    </SafeAreaView>
  );
};

export default TelaTransacoes;
