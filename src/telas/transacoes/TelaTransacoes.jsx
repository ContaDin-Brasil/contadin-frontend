import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import TituloPagina from '../../componentes/TituloPagina';
import { getLogoByName } from '../../componentes/modais/logosInstituicoes';
import { useGerenciarTransacoes } from './hooks/useGerenciarTransacoes';
import { ModalOrdenacao } from './modals/ModalOrdenacao';
import { ModalFiltros } from './modals/ModalFiltros';
import { ModalPeriodo } from './modals/ModalPeriodo';
import COLORS from '../../styles/colors';
import BotaoFlutuanteAdicionar from '../../componentes/BotaoFlutuanteAdicionar';
import { 
  formatCurrency, 
  formatDateLabel, 
  groupTransactionsByDate,
  getCategoryIcon,
  parseTransacaoDate
} from './utils/utilitariosTransacao';
import { styles } from './styles/TelaTransacoes.styles';

const TelaTransacoes = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [modalOrdenacaoVisible, setModalOrdenacaoVisible] = useState(false);
  const [modalFiltrosVisible, setModalFiltrosVisible] = useState(false);
  const [modalPeriodoVisible, setModalPeriodoVisible] = useState(false);
  const gerenciador = useGerenciarTransacoes();

  // Recebe os dados da instituição clicada (se houver)
  const instituicaoSelecionada = route.params?.instituicao || null;

  /**
   * Debounce para a busca (300ms)
   * Evita múltiplas re-renderizações enquanto o usuário digita
   */
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      if (searchQuery) {
        console.log('🔍 [SEARCH] Buscando por:', searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    gerenciador.carregarDados({
      search: debouncedSearchQuery,
      instituicaoFixaId: instituicaoSelecionada?.id,
      silencioso: true,
    }).catch((err) => {
      console.error('❌ Erro ao buscar transações por texto:', err);
    });
  }, [debouncedSearchQuery, instituicaoSelecionada?.id]);

  /**
   * Limpa o campo de busca
   */
  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  };

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
      
      gerenciador.carregarDados({
        search: debouncedSearchQuery,
        instituicaoFixaId: instituicaoSelecionada?.id,
      }).then(() => {
        setLastUpdate(new Date());
        console.log('✅ Dados atualizados com sucesso!');
        console.log('⏰ Última atualização:', new Date().toLocaleTimeString('pt-BR'));
        console.log('='.repeat(60) + '\n');
      }).catch((err) => {
        console.error('❌ Erro ao atualizar dados:', err);
        console.log('='.repeat(60) + '\n');
      });
    }, [instituicaoSelecionada?.id])
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
      await gerenciador.carregarDados({
        search: debouncedSearchQuery,
        instituicaoFixaId: instituicaoSelecionada?.id,
      });
      setLastUpdate(new Date());
      console.log('✅ Dados atualizados manualmente com sucesso!');
      console.log('⏰ Última atualização:', new Date().toLocaleTimeString('pt-BR'));
    } catch (err) {
      console.error('❌ Erro ao atualizar:', err);
    } finally {
      setRefreshing(false);
      console.log('='.repeat(60) + '\n');
    }
  }, [instituicaoSelecionada?.id]);

  // Mostra loading
  if (gerenciador.loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
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
          onPress={() =>
            gerenciador.carregarDados({
              search: debouncedSearchQuery,
              instituicaoFixaId: instituicaoSelecionada?.id,
            })
          }
        >
          <Ionicons name="refresh" size={20} color="#666" />
          <Text style={styles.filterButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const transacoesOrdenadas = gerenciador.transacoes;

  const groupedTransactions = groupTransactionsByDate(transacoesOrdenadas);

  /**
   * Converte dados agrupados em lista plana para FlatList
   * Formato: [{ type: 'header', date: '...' }, { type: 'transaction', data: {...} }, ...]
   */
  const prepararListaPlana = () => {
    const listaPlana = [];
    
    Object.entries(groupedTransactions).forEach(([date, transactions]) => {
      // Adiciona header da data
      listaPlana.push({ type: 'header', date, id: `header-${date}` });
      
      // Adiciona transações
      transactions.forEach(transaction => {
        listaPlana.push({ type: 'transaction', data: transaction, id: `transaction-${transaction.id}` });
      });
    });
    
    return listaPlana;
  };

  const flatListData = prepararListaPlana();


  // Conta filtros ativos
  const countFiltrosAtivos = () => {
    let count = 0;
    if (gerenciador.filtros.tipo !== 'TODOS') count++;
    if (gerenciador.filtros.instituicoes.length > 0) count++;
    if (gerenciador.filtros.categorias.length > 0) count++;
    if (gerenciador.filtros.valorMin || gerenciador.filtros.valorMax) count++;
    if (gerenciador.filtros.apenasParcelado) count++;
    if (gerenciador.filtros.apenasRecorrente) count++;
    if (gerenciador.filtros.dataInicio || gerenciador.filtros.dataFim) count++;
    return count;
  };

  /**
   * Renderiza item da FlatList (header de data ou transação)
   */
  const renderListItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.dateGroup}>
          <Text style={styles.dateLabel}>{formatDateLabel(item.date)}</Text>
        </View>
      );
    }
    
    if (item.type === 'transaction') {
      return renderTransactionItem(item.data);
    }
    
    return null;
  };

  const renderTransactionItem = (item) => {
    const category = gerenciador.buscarCategoria(item.fkCategoria);
    const institution = gerenciador.buscarInstituicao(item.fkInstituicao);
    const possuiVinculoCategoria =
      item.fkCategoria !== null &&
      item.fkCategoria !== undefined &&
      String(item.fkCategoria) !== 'SEM_CATEGORIA';
    const categoryName = category?.nome || (possuiVinculoCategoria ? 'Categoria vinculada' : 'Categoria não informada');
    const institutionName = institution?.nome || 'Sem instituição';
    const institutionColor = institution?.cor || '#666';
    const institutionIcon = institution?.icone || '📱';
    const institutionLogo = getLogoByName(institutionName);
    const transactionDate = parseTransacaoDate(item.dataTransacao).toLocaleDateString('pt-BR');
    
    // Mapeia frequência para texto amigável
    const getFrequencyLabel = (freq) => {
      const map = {
        'DIARIO': 'Diária',
        'SEMANAL': 'Semanal',
        'MENSAL': 'Mensal',
        'ANUAL': 'Anual'
      };
      return map[freq] || freq;
    };
    
    return (
      <TouchableOpacity 
        key={item.id} 
        style={styles.transactionItem}
        onPress={() => navigation.navigate('EditarTransacao', { transacaoId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.transactionHeader}>
          <View style={styles.transactionIcon}>
            <MaterialIcons name={category?.icone || getCategoryIcon(categoryName)} size={24} color="#333" />
          </View>
          <Text style={styles.transactionCategory}>{categoryName}</Text>
          
          <View style={styles.transactionHeaderRight}>
            <Text style={styles.transactionDate}>{transactionDate}</Text>
            
            {/* Badges de Parcelamento e Recorrência abaixo da data */}
            {(item.parcelado || item.recorrencia) && (
              <View style={styles.transactionBadgesRow}>
                {item.parcelado && item.qtdParcelas && (
                  <View style={styles.transactionBadge}>
                    <Ionicons name="card-outline" size={12} color={COLORS.primary} />
                    <Text style={styles.transactionBadgeText}>{item.qtdParcelas}x</Text>
                  </View>
                )}
                {item.recorrencia && (
                  <View style={[styles.transactionBadge, styles.recurrenceBadge]}>
                    <Ionicons name="repeat-outline" size={12} color={COLORS.success} />
                    <Text style={[styles.transactionBadgeText, styles.recurrenceBadgeText]}>
                      {getFrequencyLabel(item.recorrencia)}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
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

      {/* Filtro de Período */}
      <TouchableOpacity 
        style={styles.periodFilter}
        onPress={() => setModalPeriodoVisible(true)}
      >
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
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.clearSearchButton}
            onPress={handleClearSearch}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros */}
      <View style={styles.filtersRow}>
        <TouchableOpacity 
          style={styles.sortFilter}
          onPress={() => setModalOrdenacaoVisible(true)}
        >
          <Text style={styles.sortFilterText}>{gerenciador.ordenacao}</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setModalFiltrosVisible(true)}
        >
          <Ionicons name="options-outline" size={18} color="#666" />
          <Text style={styles.filterButtonText}>Filtros</Text>
          {countFiltrosAtivos() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{countFiltrosAtivos()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Indicador de Última Atualização */}
      <View style={styles.lastUpdateContainer}>
        <Ionicons name="time-outline" size={12} color="#999" />
        <Text style={styles.lastUpdateText}>
          Atualizado às {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {transacoesOrdenadas.length > 0 && (
          <>
            <Text style={[styles.lastUpdateText, { marginHorizontal: 8 }]}>•</Text>
            <Text style={styles.lastUpdateText}>
              {transacoesOrdenadas.length} transações
            </Text>
          </>
        )}
      </View>

      {/* Lista de Transações */}
      <FlatList 
        data={flatListData}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
        
        // Pull to refresh
        refreshing={refreshing}
        onRefresh={onRefresh}
        
        // Empty state
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons 
              name={debouncedSearchQuery ? "search-outline" : "receipt-outline"} 
              size={64} 
              color="#CCC" 
            />
            <Text style={styles.emptyStateTitle}>
              {debouncedSearchQuery 
                ? "Nenhum resultado encontrado" 
                : "Nenhuma transação"}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {debouncedSearchQuery 
                ? `Não encontramos transações para "${debouncedSearchQuery}"`
                : "Adicione sua primeira transação tocando no botão +"}
            </Text>
            {debouncedSearchQuery && (
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={handleClearSearch}
              >
                <Text style={styles.emptyStateButtonText}>Limpar busca</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Botão Flutuante */}
      <BotaoFlutuanteAdicionar
        onPress={() => navigation.navigate('AdicionarTransacao')}
      />

      {/* Modal de Ordenação */}
      <ModalOrdenacao
        visible={modalOrdenacaoVisible}
        onClose={() => setModalOrdenacaoVisible(false)}
        ordenacaoAtual={gerenciador.ordenacao}
        onSelectOrdenacao={(novaOrdenacao) => {
          gerenciador.aplicarOrdenacao(novaOrdenacao, {
            search: debouncedSearchQuery,
            instituicaoFixaId: instituicaoSelecionada?.id,
            silencioso: true,
          }).catch((err) => {
            console.error('❌ Erro ao aplicar ordenação:', err);
          });
        }}
      />

      {/* Modal de Filtros */}
      <ModalFiltros
        visible={modalFiltrosVisible}
        onClose={() => setModalFiltrosVisible(false)}
        filtrosAtuais={gerenciador.filtros}
        onAplicarFiltros={(novosFiltros) => {
          gerenciador.aplicarFiltros(novosFiltros, {
            search: debouncedSearchQuery,
            instituicaoFixaId: instituicaoSelecionada?.id,
            silencioso: true,
          }).catch((err) => {
            console.error('❌ Erro ao aplicar filtros:', err);
          });
        }}
        instituicoes={gerenciador.instituicoes}
        categorias={gerenciador.categorias}
      />

      {/* Modal de Período */}
      <ModalPeriodo
        visible={modalPeriodoVisible}
        onClose={() => setModalPeriodoVisible(false)}
        periodoAtual={gerenciador.periodo}
        dataInicio={gerenciador.filtros.dataInicio}
        dataFim={gerenciador.filtros.dataFim}
        onAplicarPeriodo={(periodo, dataInicio, dataFim) => {
          gerenciador.setPeriodo(periodo);
          gerenciador.aplicarFiltros({
            ...gerenciador.filtros,
            dataInicio,
            dataFim
          }, {
            search: debouncedSearchQuery,
            instituicaoFixaId: instituicaoSelecionada?.id,
            silencioso: true,
          }).catch((err) => {
            console.error('❌ Erro ao aplicar período:', err);
          });
        }}
      />
    </SafeAreaView>
  );
};

export default TelaTransacoes;
