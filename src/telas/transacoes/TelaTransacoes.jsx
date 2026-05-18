import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import TituloPagina from "../../componentes/TituloPagina";
import { getLogoByName } from "../../componentes/modais/logosInstituicoes";
import { useGerenciarTransacoes } from "./hooks/useGerenciarTransacoes";
import { ModalOrdenacao } from "./modals/ModalOrdenacao";
import { ModalFiltros } from "./modals/ModalFiltros";
import { ModalPeriodo } from "./modals/ModalPeriodo";
import COLORS from "../../styles/colors";
import BotaoFlutuanteAdicionar from "../../componentes/BotaoFlutuanteAdicionar";
import {
  formatCurrency,
  formatDateLabel,
  groupTransactionsByDate,
  getCategoryIcon,
  parseTransacaoDate,
} from "./utils/utilitariosTransacao";
import { styles } from "./styles/TelaTransacoes.styles";

const TelaTransacoes = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [modalOrdenacaoVisible, setModalOrdenacaoVisible] = useState(false);
  const [modalFiltrosVisible, setModalFiltrosVisible] = useState(false);
  const [modalPeriodoVisible, setModalPeriodoVisible] = useState(false);
  const [modalVisualizacaoVisible, setModalVisualizacaoVisible] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState('TRANSACOES'); // 'TRANSACOES', 'RECORRENCIAS' ou 'PARCELADOS'
  const gerenciador = useGerenciarTransacoes();

  // Recebe os dados da instituição clicada (se houver)
  const instituicaoSelecionada = route.params?.instituicao || null;

  const carregarDadosRef = React.useRef(gerenciador.carregarDados);
  React.useEffect(() => {
    carregarDadosRef.current = gerenciador.carregarDados;
  });

  const debouncedSearchQueryRef = React.useRef(debouncedSearchQuery);
  React.useEffect(() => {
    debouncedSearchQueryRef.current = debouncedSearchQuery;
  }, [debouncedSearchQuery]);

  /**
   * Debounce para a busca (300ms)
   * Evita múltiplas re-renderizações enquanto o usuário digita
   */
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      if (searchQuery) {
        console.log("🔍 [SEARCH] Buscando por:", searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Efeito para aplicar filtro automático quando muda o modo de visualização
   */
  React.useEffect(() => {
    let novosFiltros = { ...gerenciador.filtros };

    if (modoVisualizacao === 'RECORRENCIAS') {
      novosFiltros.apenasRecorrente = true;
      novosFiltros.apenasParcelado = false;
    } else if (modoVisualizacao === 'PARCELADOS') {
      novosFiltros.apenasParcelado = true;
      novosFiltros.apenasRecorrente = false;
    } else {
      // TRANSACOES - remove ambos os filtros
      novosFiltros.apenasRecorrente = false;
      novosFiltros.apenasParcelado = false;
    }

    gerenciador.aplicarFiltros(novosFiltros, {
      search: debouncedSearchQuery,
      instituicaoFixaId: instituicaoSelecionada?.id,
    }).catch((err) => {
      console.error('❌ Erro ao aplicar filtros de visualização:', err);
    });
  }, [modoVisualizacao]);

  /**
   * Efeito para aplicar filtro automático quando muda o modo de visualização
   */
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
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  // Log para debug (pode remover depois)
  React.useEffect(() => {
    if (instituicaoSelecionada) {
      console.log("📍 Instituição selecionada:", instituicaoSelecionada);
      console.log("   - Nome:", instituicaoSelecionada.nome);
      console.log("   - Tipo:", instituicaoSelecionada.tipo);
      console.log("   - ID:", instituicaoSelecionada.id);
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
      
      // Recarrega com os filtros atuais (incluindo o filtro de recorrências/parcelados se aplicável)
      let filtrosAaplicar = { ...gerenciador.filtros };
      
      if (modoVisualizacao === 'RECORRENCIAS') {
        filtrosAaplicar.apenasRecorrente = true;
        filtrosAaplicar.apenasParcelado = false;
      } else if (modoVisualizacao === 'PARCELADOS') {
        filtrosAaplicar.apenasParcelado = true;
        filtrosAaplicar.apenasRecorrente = false;
      } else {
        filtrosAaplicar.apenasRecorrente = false;
        filtrosAaplicar.apenasParcelado = false;
      }

      gerenciador.carregarDados({
        search: debouncedSearchQuery,
        instituicaoFixaId: instituicaoSelecionada?.id,
        filtrosOverride: filtrosAaplicar,
      }).then(() => {
        setLastUpdate(new Date());
        console.log('✅ Dados atualizados com sucesso!');
        console.log('⏰ Última atualização:', new Date().toLocaleTimeString('pt-BR'));
        console.log('='.repeat(60) + '\n');
      }).catch((err) => {
        console.error('❌ Erro ao atualizar dados:', err);
        console.log('='.repeat(60) + '\n');
      });
    }, [instituicaoSelecionada?.id, modoVisualizacao, debouncedSearchQuery])
  );

  /**
   * Handler para pull-to-refresh manual
   */
  const onRefresh = React.useCallback(async () => {
    console.log("\n" + "=".repeat(60));
    console.log("🔄 [MANUAL-REFRESH] Usuário solicitou atualização");
    console.log("=".repeat(60));

    setRefreshing(true);
    try {
      let filtrosAaplicar = { ...gerenciador.filtros };
      
      if (modoVisualizacao === 'RECORRENCIAS') {
        filtrosAaplicar.apenasRecorrente = true;
        filtrosAaplicar.apenasParcelado = false;
      } else if (modoVisualizacao === 'PARCELADOS') {
        filtrosAaplicar.apenasParcelado = true;
        filtrosAaplicar.apenasRecorrente = false;
      } else {
        filtrosAaplicar.apenasRecorrente = false;
        filtrosAaplicar.apenasParcelado = false;
      }

      await gerenciador.carregarDados({
        search: debouncedSearchQuery,
        instituicaoFixaId: instituicaoSelecionada?.id,
        filtrosOverride: filtrosAaplicar,
      });
      setLastUpdate(new Date());
      console.log("✅ Dados atualizados manualmente com sucesso!");
      console.log(
        "⏰ Última atualização:",
        new Date().toLocaleTimeString("pt-BR"),
      );
    } catch (err) {
      console.error("❌ Erro ao atualizar:", err);
    } finally {
      setRefreshing(false);
      console.log("=".repeat(60) + "\n");
    }
  }, [instituicaoSelecionada?.id, modoVisualizacao, debouncedSearchQuery]);

  // Mostra loading
  if (gerenciador.loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16, color: "#666" }}>
          Carregando transações...
        </Text>
      </View>
    );
  }

  // Mostra erro
  if (gerenciador.error) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", padding: 20 },
        ]}
      >
        <Ionicons name="alert-circle-outline" size={64} color="#E31C23" />
        <Text style={{ marginTop: 16, color: "#E31C23", textAlign: "center" }}>
          {gerenciador.error}
        </Text>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { marginTop: 20, paddingHorizontal: 20 },
          ]}
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
      listaPlana.push({ type: "header", date, id: `header-${date}` });

      // Adiciona transações
      transactions.forEach((transaction) => {
        listaPlana.push({
          type: "transaction",
          data: transaction,
          id: `transaction-${transaction.id}`,
        });
      });
    });

    return listaPlana;
  };

  const flatListData = prepararListaPlana();

  // Conta filtros ativos
  const countFiltrosAtivos = () => {
    let count = 0;
    if (gerenciador.filtros.tipo !== "TODOS") count++;
    if (gerenciador.filtros.instituicoes.length > 0) count++;
    if (gerenciador.filtros.categorias.length > 0) count++;
    if (gerenciador.filtros.valorMin || gerenciador.filtros.valorMax) count++;
    if (gerenciador.filtros.apenasParcelado) count++;
    if (gerenciador.filtros.apenasRecorrente) count++;
    if (gerenciador.filtros.dataInicio || gerenciador.filtros.dataFim) count++;
    return count;
  };

  /**
   * Renderiza transação em modo recorrências
   * Design mais prático para visualizar essas "contas recorrentes"
   */
  const renderTransactionItemRecorrencia = (item) => {
    const category = gerenciador.buscarCategoria(item.fkCategoria);
    const institution = gerenciador.buscarInstituicao(item.fkInstituicao);
    const categoryName = category?.nome || 'Categoria não informada';
    const institutionName = institution?.nome || 'Sem instituição';
    const institutionColor = institution?.cor || '#666';
    const institutionLogo = getLogoByName(institutionName);
    
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

    // Calcula status: ativa ou inativa (por fim de recorrência)
    const dataFim = item.fimRecorrencia ? parseTransacaoDate(item.fimRecorrencia) : null;
    const hoje = new Date();
    const ativa = !dataFim || dataFim > hoje;
    
    // Calcula dias até o fim
    let diasAteFim = null;
    if (dataFim && dataFim > hoje) {
      diasAteFim = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Próxima data de cobrança (assumindo que é a dataTransacao)
    const proximaData = parseTransacaoDate(item.dataTransacao).toLocaleDateString('pt-BR');

    return (
      <TouchableOpacity 
        key={item.id} 
        style={[styles.recorrenciaItem, !ativa && styles.recorrenciaItemInativa]}
        onPress={() => navigation.navigate('EditarTransacao', { transacaoId: item.id })}
        activeOpacity={0.85}
      >
        {/* Header: Descrição + Valor */}
        <View style={styles.recorrenciaHeader}>
          <View style={styles.recorrenciaDescricao}>
            <Text style={styles.recorrenciaTitle}>{item.descricao}</Text>
          </View>
          <Text style={[
            styles.recorrenciaValor,
            item.tipo === 'RECEITA' ? styles.incomeAmount : styles.expenseAmount
          ]}>
            {formatCurrency(item.tipo === 'RECEITA' ? item.valor : -item.valor)}
          </Text>
        </View>

        {/* Status Inline */}
        <View style={styles.recorrenciaStatusInline}>
          <Ionicons 
            name={ativa ? "checkmark-circle" : "close-circle"} 
            size={14} 
            color={ativa ? COLORS.success : COLORS.error} 
          />
          <Text style={[
            styles.recorrenciaStatusInlineText,
            ativa ? { color: COLORS.success } : { color: COLORS.error }
          ]}>
            {ativa ? 'Ativa' : 'Inativa'}
          </Text>
        </View>

        {/* Linha: Categoria + Logo da Instituição */}
        <View style={styles.recorrenciaSecondaryRow}>
          {/* Categoria com ícone */}
          <View style={styles.recorrenciaCategoryBadge}>
            <MaterialIcons 
              name={category?.icone || getCategoryIcon(categoryName)} 
              size={14} 
              color="#666" 
            />
            <Text style={styles.recorrenciaCategoryText}>{categoryName}</Text>
          </View>

          {/* Instituição com Logo */}
          <View style={[styles.institutionBadgeSmall, { borderColor: institutionColor }]}>
            {institutionLogo ? (
              <Image 
                source={institutionLogo} 
                style={styles.institutionBadgeLogoSmall}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.institutionBadgeIcon}>{institution?.icone || '📱'}</Text>
            )}
            <Text style={styles.institutionBadgeTextSmall} numberOfLines={1}>
              {institutionName}
            </Text>
          </View>
        </View>

        {/* Linha: Frequência + Próxima Data */}
        <View style={styles.recorrenciaThirdRow}>
          <View style={styles.recorrenciaFrequencia}>
            <Ionicons name="repeat-outline" size={14} color={COLORS.primary} />
            <Text style={styles.recorrenciaFrequenciaText}>
              {getFrequencyLabel(item.recorrencia)}
            </Text>
          </View>
          
          <View style={styles.recorrenciaProximaData}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.recorrenciaProximaDataText}>
              {proximaData}
            </Text>
          </View>
        </View>

        {/* Footer: Data de Fim (se houver) */}
        {dataFim && (
          <View style={styles.recorrenciaFooter}>
            <Ionicons 
              name={ativa ? "alarm-outline" : "alert-circle-outline"} 
              size={14} 
              color={ativa ? '#999' : COLORS.error} 
            />
            <Text style={[
              styles.recorrenciaDataFimFooter,
              ativa ? { color: '#999' } : { color: COLORS.error }
            ]}>
              {ativa 
                ? `Vence em ${diasAteFim} dia${diasAteFim !== 1 ? 's' : ''} (${dataFim.toLocaleDateString('pt-BR')})`
                : `Vencida em ${dataFim.toLocaleDateString('pt-BR')}`
              }
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  /**
   * Renderiza transação em modo parcelados
   * Mostra informações sobre o parcelamento
   */
  const renderTransactionItemParcelado = (item) => {
    const category = gerenciador.buscarCategoria(item.fkCategoria);
    const institution = gerenciador.buscarInstituicao(item.fkInstituicao);
    const categoryName = category?.nome || 'Categoria não informada';
    const institutionName = institution?.nome || 'Sem instituição';
    const institutionColor = institution?.cor || '#666';
    const institutionLogo = getLogoByName(institutionName);

    // Usa fimRecorrencia como data final do parcelamento (calculada no cadastro)
    const dataInicio = parseTransacaoDate(item.dataTransacao);
    const hoje = new Date();
    
    // Calcula qtdParcelas se não estiver disponível no servidor
    let qtdParcelas = item.qtdParcelas;
    if (!qtdParcelas && item.fimRecorrencia) {
      const dataFim = parseTransacaoDate(item.fimRecorrencia);
      const mesesEntre = 
        (dataFim.getFullYear() - dataInicio.getFullYear()) * 12 + 
        (dataFim.getMonth() - dataInicio.getMonth());
      qtdParcelas = mesesEntre + 1;
      
      console.log(`📅 [CALC PARCELAS] Calculado a partir de fimRecorrencia:
        • Data início: ${dataInicio.toLocaleDateString('pt-BR')}
        • Data fim: ${dataFim.toLocaleDateString('pt-BR')}
        • Meses entre: ${mesesEntre}
        • Total parcelas: ${qtdParcelas}`);
    }
    qtdParcelas = Math.max(1, qtdParcelas || 1);

    // Calcula quantas parcelas já venceram
    // Conta os meses completos desde o início
    const mesesDesdeInicio = 
      (hoje.getFullYear() - dataInicio.getFullYear()) * 12 + 
      (hoje.getMonth() - dataInicio.getMonth());
    
    // Se estamos no mesmo dia ou depois, já contamos mais um mês
    let parcelasVencidas = mesesDesdeInicio;
    if (hoje.getDate() >= dataInicio.getDate()) {
      parcelasVencidas += 1;
    }
    
    // Garante que parcelas vencidas fica entre 1 e qtdParcelas
    parcelasVencidas = Math.max(1, Math.min(parcelasVencidas, qtdParcelas));
    const parcelasRestantes = Math.max(0, qtdParcelas - parcelasVencidas);
    
    // Data da próxima parcela (se ainda não finalizou)
    const proximaParcela = new Date(dataInicio);
    proximaParcela.setMonth(proximaParcela.getMonth() + parcelasVencidas);
    
    // Progresso em porcentagem
    const percentualProgresso = (parcelasVencidas / qtdParcelas) * 100;
    
    // Verifica se é concluído: quando vencidas >= total, mas deixa margem de 1 dia para coincidência de datas
    const concluido = parcelasVencidas >= qtdParcelas;

    return (
      <TouchableOpacity 
        key={item.id} 
        style={[styles.parceladoItem, concluido && styles.parceladoItemConcluido]}
        onPress={() => navigation.navigate('EditarTransacao', { transacaoId: item.id })}
        activeOpacity={0.85}
      >
        {/* Header: Descrição + Valor */}
        <View style={styles.parceladoHeader}>
          <View style={styles.parceladoDescricao}>
            <Text style={styles.parceladoTitle}>{item.descricao}</Text>
          </View>
          <View style={styles.parceladoValorContainer}>
            <Text style={[
              styles.parceladoValor,
              item.tipo === 'RECEITA' ? styles.incomeAmount : styles.expenseAmount
            ]}>
              {formatCurrency(item.tipo === 'RECEITA' ? item.valor : -item.valor)}
            </Text>
            <Text style={[
              styles.parceladoValorParcela,
              item.tipo === 'RECEITA' ? styles.incomeAmount : styles.expenseAmount
            ]}>
              {formatCurrency((item.tipo === 'RECEITA' ? item.valor : -item.valor) / qtdParcelas)} / parcela
            </Text>
          </View>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.parceladoProgressContainer}>
          <View style={styles.parceladoProgressBar}>
            <View 
              style={[
                styles.parceladoProgressFill,
                { width: `${percentualProgresso}%` }
              ]}
            />
          </View>
          <Text style={styles.parceladoProgressText}>
            {parcelasVencidas} de {qtdParcelas}
          </Text>
        </View>

        {/* Linha: Categoria + Instituição */}
        <View style={styles.parceladoSecondaryRow}>
          {/* Categoria com ícone */}
          <View style={styles.parceladoCategoryBadge}>
            <MaterialIcons 
              name={category?.icone || getCategoryIcon(categoryName)} 
              size={14} 
              color="#666" 
            />
            <Text style={styles.parceladoCategoryText}>{categoryName}</Text>
          </View>

          {/* Instituição com Logo */}
          <View style={[styles.institutionBadgeSmall, { borderColor: institutionColor }]}>
            {institutionLogo ? (
              <Image 
                source={institutionLogo} 
                style={styles.institutionBadgeLogoSmall}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.institutionBadgeIcon}>{institution?.icone || '📱'}</Text>
            )}
            <Text style={styles.institutionBadgeTextSmall} numberOfLines={1}>
              {institutionName}
            </Text>
          </View>
        </View>

        {/* Footer: Informação das parcelas restantes */}
        {parcelasRestantes > 0 ? (
          <View style={styles.parceladoFooter}>
            <Ionicons 
              name="calendar-outline" 
              size={14} 
              color="#666" 
            />
            <Text style={styles.parceladoFooterText}>
              {parcelasRestantes} parcela{parcelasRestantes !== 1 ? 's' : ''} restante{parcelasRestantes !== 1 ? 's' : ''} • Próxima: {proximaParcela.toLocaleDateString('pt-BR')}
            </Text>
          </View>
        ) : (
          <View style={[styles.parceladoFooter, styles.parceladoFooterConcluido]}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
            <Text style={[styles.parceladoFooterText, { color: COLORS.success }]}>
              Parcelamento concluído!
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  /**
   * Renderiza item da FlatList (header de data ou transação)
   */
  const renderListItem = ({ item }) => {
    if (item.type === 'header' && modoVisualizacao === 'TRANSACOES') {
      return (
        <View style={styles.dateGroup}>
          <Text style={styles.dateLabel}>{formatDateLabel(item.date)}</Text>
        </View>
      );
    }
    
    if (item.type === 'transaction') {
      return modoVisualizacao === 'RECORRENCIAS' 
        ? renderTransactionItemRecorrencia(item.data)
        : modoVisualizacao === 'PARCELADOS'
        ? renderTransactionItemParcelado(item.data)
        : renderTransactionItem(item.data);
    }

    return null;
  };

  const renderTransactionItem = (item) => {
    const category = gerenciador.buscarCategoria(item.fkCategoria);
    const institution = gerenciador.buscarInstituicao(item.fkInstituicao);
    const possuiVinculoCategoria =
      item.fkCategoria !== null &&
      item.fkCategoria !== undefined &&
      String(item.fkCategoria) !== "SEM_CATEGORIA";
    const categoryName =
      category?.nome ||
      (possuiVinculoCategoria
        ? "Categoria Inativa"
        : "Categoria não informada");
    const institutionName = institution?.nome || "Sem instituição";
    const institutionColor = institution?.cor || "#666";
    const institutionIcon = institution?.icone || "📱";
    const institutionLogo = getLogoByName(institutionName);
    const transactionDate = parseTransacaoDate(
      item.dataTransacao,
    ).toLocaleDateString("pt-BR");

    // Mapeia frequência para texto amigável
    const getFrequencyLabel = (freq) => {
      const map = {
        DIARIO: "Diária",
        SEMANAL: "Semanal",
        MENSAL: "Mensal",
        ANUAL: "Anual",
      };
      return map[freq] || freq;
    };

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.transactionItem}
        onPress={() =>
          navigation.navigate("EditarTransacao", { transacaoId: item.id })
        }
        activeOpacity={0.7}
      >
        <View style={styles.transactionHeader}>
          <View style={styles.transactionIcon}>
            <MaterialIcons
              name={category?.icone || getCategoryIcon(categoryName)}
              size={24}
              color="#333"
            />
          </View>
          <Text style={styles.transactionCategory}>{categoryName}</Text>

          <View style={styles.transactionHeaderRight}>
            <Text style={styles.transactionDate}>{transactionDate}</Text>

            {/* Badges de Parcelamento e Recorrência abaixo da data */}
            {(item.parcelado || item.recorrencia) && (
              <View style={styles.transactionBadgesRow}>
                {item.parcelado && item.qtdParcelas && (
                  <View style={styles.transactionBadge}>
                    <Ionicons
                      name="card-outline"
                      size={12}
                      color={COLORS.primary}
                    />
                    <Text style={styles.transactionBadgeText}>
                      {item.qtdParcelas}x
                    </Text>
                  </View>
                )}
                {item.recorrencia && (
                  <View
                    style={[styles.transactionBadge, styles.recurrenceBadge]}
                  >
                    <Ionicons
                      name="repeat-outline"
                      size={12}
                      color={COLORS.success}
                    />
                    <Text
                      style={[
                        styles.transactionBadgeText,
                        styles.recurrenceBadgeText,
                      ]}
                    >
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
            <View
              style={[
                styles.institutionBadge,
                {
                  backgroundColor: institutionLogo
                    ? "#FFF"
                    : institutionColor + "20",
                  borderColor: institutionColor,
                },
              ]}
            >
              {institutionLogo ? (
                <Image
                  source={institutionLogo}
                  style={styles.institutionBadgeLogo}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.institutionBadgeIcon}>
                  {institutionIcon}
                </Text>
              )}
              <Text style={[styles.institutionBadgeText]}>
                {institutionName}
              </Text>
            </View>
            <Text style={styles.transactionDescription}>{item.descricao}</Text>
          </View>

          <Text
            style={[
              styles.transactionAmount,
              item.tipo === "RECEITA"
                ? styles.incomeAmount
                : styles.expenseAmount,
            ]}
          >
            {formatCurrency(item.tipo === "RECEITA" ? item.valor : -item.valor)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Título com Seletor de Visualização (Transações/Recorrências/Parcelados) */}
      <TouchableOpacity 
        style={styles.tituloSeletorContainer}
        onPress={() => setModalVisualizacaoVisible(true)}
      >
        <Text style={styles.tituloSeletor}>
          {modoVisualizacao === 'RECORRENCIAS' ? 'Recorrências' : modoVisualizacao === 'PARCELADOS' ? 'Parcelados' : 'Transações'}
        </Text>
        <Ionicons name="chevron-down" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      {/* Banner de Instituição Selecionada */}
      {instituicaoSelecionada &&
        (() => {
          const bannerLogo = getLogoByName(instituicaoSelecionada.nome);
          return (
            <View
              style={[
                styles.selectedInstitutionBanner,
                {
                  backgroundColor: instituicaoSelecionada.cor + "20",
                  borderColor: instituicaoSelecionada.cor,
                },
              ]}
            >
              <View style={styles.bannerContent}>
                <View
                  style={[
                    styles.bannerIcon,
                    {
                      backgroundColor: bannerLogo
                        ? "#FFF"
                        : instituicaoSelecionada.cor,
                    },
                  ]}
                >
                  {bannerLogo ? (
                    <Image
                      source={bannerLogo}
                      style={styles.bannerLogoImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.bannerIconText}>
                      {instituicaoSelecionada.icone}
                    </Text>
                  )}
                </View>
                <View style={styles.bannerInfo}>
                  <Text style={styles.bannerTitle}>
                    {instituicaoSelecionada.nome}
                  </Text>
                  <Text style={styles.bannerSubtitle}>
                    {instituicaoSelecionada.tipo === "banco"
                      ? "🏦 Banco"
                      : "🎫 Vale"}{" "}
                    • {instituicaoSelecionada.balance}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.bannerClose}
                onPress={() => navigation.setParams({ instituicao: null })}
              >
                <Ionicons
                  name="close-circle"
                  size={24}
                  color={instituicaoSelecionada.cor}
                />
              </TouchableOpacity>
            </View>
          );
        })()}

      {/* Filtro de Período - Visível apenas em modo Transações */}
      {modoVisualizacao === 'TRANSACOES' && (
        <TouchableOpacity 
          style={styles.periodFilter}
          onPress={() => setModalPeriodoVisible(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.periodFilterText}>{gerenciador.periodo}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      )}

      {/* Campo de Pesquisa - Visível apenas em modo Transações */}
      {modoVisualizacao === 'TRANSACOES' && (
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
      )}

      {/* Filtros - Visível apenas em modo Transações */}
      {modoVisualizacao === 'TRANSACOES' ? (
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
      ) : (
        // Modo Recorrências: apenas ordenação
        <View style={styles.filtersRow}>
          <TouchableOpacity 
            style={styles.sortFilter}
            onPress={() => setModalOrdenacaoVisible(true)}
          >
            <Text style={styles.sortFilterText}>{gerenciador.ordenacao}</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
      )}

      {/* Indicador de Última Atualização */}
      <View style={styles.lastUpdateContainer}>
        <Ionicons name="time-outline" size={12} color="#999" />
        <Text style={styles.lastUpdateText}>
          Atualizado às{" "}
          {lastUpdate.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        {transacoesOrdenadas.length > 0 && (
          <>
            <Text style={[styles.lastUpdateText, { marginHorizontal: 8 }]}>
              •
            </Text>
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
        onPress={() => navigation.navigate("AdicionarTransacao")}
      />

      {/* Modal de Ordenação */}
      <ModalOrdenacao
        visible={modalOrdenacaoVisible}
        onClose={() => setModalOrdenacaoVisible(false)}
        ordenacaoAtual={gerenciador.ordenacao}
        onSelectOrdenacao={(novaOrdenacao) => {
          gerenciador
            .aplicarOrdenacao(novaOrdenacao, {
              search: debouncedSearchQuery,
              instituicaoFixaId: instituicaoSelecionada?.id,
              silencioso: true,
            })
            .catch((err) => {
              console.error("❌ Erro ao aplicar ordenação:", err);
            });
        }}
      />

      {/* Modal de Filtros */}
      <ModalFiltros
        visible={modalFiltrosVisible}
        onClose={() => setModalFiltrosVisible(false)}
        filtrosAtuais={gerenciador.filtros}
        onAplicarFiltros={(novosFiltros) => {
          gerenciador
            .aplicarFiltros(novosFiltros, {
              search: debouncedSearchQuery,
              instituicaoFixaId: instituicaoSelecionada?.id,
              silencioso: true,
            })
            .catch((err) => {
              console.error("❌ Erro ao aplicar filtros:", err);
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
          gerenciador
            .aplicarFiltros(
              {
                ...gerenciador.filtros,
                dataInicio,
                dataFim,
              },
              {
                search: debouncedSearchQuery,
                instituicaoFixaId: instituicaoSelecionada?.id,
                silencioso: true,
              },
            )
            .catch((err) => {
              console.error("❌ Erro ao aplicar período:", err);
            });
        }}
      />

      {/* Modal de Seleção de Visualização (Transações/Recorrências) */}
      {modalVisualizacaoVisible && (
        <SafeAreaView 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            zIndex: 999,
            display: 'flex',
          }}
        >
          <TouchableOpacity 
            style={{ 
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
            onPress={() => setModalVisualizacaoVisible(false)}
          />
        <View style={styles.modalVisualizacao}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Visualizar</Text>
            <TouchableOpacity 
              onPress={() => setModalVisualizacaoVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalOpcoes}>
            {/* Opção Transações */}
            <TouchableOpacity 
              style={[
                styles.modalOpcao,
                modoVisualizacao === 'TRANSACOES' && styles.modalOpcaoSelecionada
              ]}
              onPress={() => {
                setModoVisualizacao('TRANSACOES');
                setModalVisualizacaoVisible(false);
              }}
            >
              <Ionicons 
                name="receipt-outline" 
                size={24} 
                color={modoVisualizacao === 'TRANSACOES' ? COLORS.primary : '#666'} 
              />
              <Text style={[
                styles.modalOpcaoTexto,
                modoVisualizacao === 'TRANSACOES' && styles.modalOpcaoTextoSelecionado
              ]}>
                Transações
              </Text>
              {modoVisualizacao === 'TRANSACOES' && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>

            {/* Opção Recorrências */}
            <TouchableOpacity 
              style={[
                styles.modalOpcao,
                modoVisualizacao === 'RECORRENCIAS' && styles.modalOpcaoSelecionada
              ]}
              onPress={() => {
                setModoVisualizacao('RECORRENCIAS');
                setModalVisualizacaoVisible(false);
              }}
            >
              <Ionicons 
                name="repeat-outline" 
                size={24} 
                color={modoVisualizacao === 'RECORRENCIAS' ? COLORS.primary : '#666'} 
              />
              <Text style={[
                styles.modalOpcaoTexto,
                modoVisualizacao === 'RECORRENCIAS' && styles.modalOpcaoTextoSelecionado
              ]}>
                Recorrências
              </Text>
              {modoVisualizacao === 'RECORRENCIAS' && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>

            {/* Opção Parcelados */}
            <TouchableOpacity 
              style={[
                styles.modalOpcao,
                modoVisualizacao === 'PARCELADOS' && styles.modalOpcaoSelecionada
              ]}
              onPress={() => {
                setModoVisualizacao('PARCELADOS');
                setModalVisualizacaoVisible(false);
              }}
            >
              <Ionicons 
                name="layers-outline" 
                size={24} 
                color={modoVisualizacao === 'PARCELADOS' ? COLORS.primary : '#666'} 
              />
              <Text style={[
                styles.modalOpcaoTexto,
                modoVisualizacao === 'PARCELADOS' && styles.modalOpcaoTextoSelecionado
              ]}>
                Parcelados
              </Text>
              {modoVisualizacao === 'PARCELADOS' && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

export default TelaTransacoes;
