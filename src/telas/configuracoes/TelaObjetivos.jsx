import React, { useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import TituloPagina from '../../componentes/TituloPagina';
import BotaoFlutuanteAdicionar from '../../componentes/BotaoFlutuanteAdicionar';
import { COLORS } from '../../styles/colors';
import { styles } from './styles/TelaObjetivos.styles';
import { useGerenciarObjetivos } from './hooks/useGerenciarObjetivos';
import { STATUS_VISUAL, TIPO_VISUAL } from '@/telas/configuracoes/objetivos/constants/constantesObjetivo';
import { formatarData } from '@/utils/dateUtils';
import { formatarMoeda, formatarMoedaDetalhada } from '@/utils/moedaUtils';
import { formatarPrioridade } from '@/telas/configuracoes/objetivos/utils/objetivoFormatters';

const TelaObjetivos = ({ navigation }) => {
  const {
    objetivos,
    resumo,
    contagem,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filtroStatus,
    setFiltroStatus,
    recarregar,
  } = useGerenciarObjetivos();

  const carregouRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!carregouRef.current) {
        carregouRef.current = true;
        return;
      }

      recarregar();
    }, [recarregar]),
  );

  const objetivosProcessados = useMemo(() => {
    return objetivos.map((objetivo) => ({
      ...objetivo,
      statusVisual: STATUS_VISUAL[objetivo.status] || STATUS_VISUAL['no caminho'],
      tipoVisual: TIPO_VISUAL[objetivo.tipo] || TIPO_VISUAL.LIMITE_GASTO,
    }));
  }, [objetivos]);

  const objetivosAtivosCount = contagem.ativos;
  const objetivosConcluidosCount = contagem.concluidos;

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina mostrarBotaoVoltar={true} onVoltar={() => navigation.goBack()}>
        Objetivos
      </TituloPagina>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.recomendacaoCard}>
          <View style={styles.recomendacaoHeader}>
            <Text style={styles.recomendacaoEyebrow}>Ação recomendada</Text>
            <View style={styles.recomendacaoIcon}>
              <Ionicons name="sparkles" size={20} color={COLORS.primaryDark} />
            </View>
          </View>
          <Text style={styles.recomendacaoText}>{resumo.recomendacao}</Text>
        </View>

        <View style={styles.kpiContainer}>
          <View style={styles.kpiRow}>
            <View style={[styles.kpiCard, styles.kpiCardHalf]}>
              <View style={styles.kpiHeader}>
                <Text style={styles.kpiLabel}>
                  Impacto
                  {'\n'}previsto no mês
                </Text>
                <View style={[styles.kpiIcon, { backgroundColor: COLORS.primaryLighter }]}>
                  <Ionicons name="trending-up" size={16} color={COLORS.primary} />
                </View>
              </View>
              <Text style={styles.kpiValue}>{formatarMoeda(resumo.impacto, true)}</Text>
            </View>
            <View style={[styles.kpiCard, styles.kpiCardHalf]}>
              <View style={styles.kpiHeader}>
                <Text style={styles.kpiLabel}>
                  Objetivos
                  {'\n'}no ritmo
                </Text>
                <View style={[styles.kpiIcon, { backgroundColor: '#E9F8EF' }]}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                </View>
              </View>
              <Text style={styles.kpiValue}>
                {resumo.noRitmo} de {resumo.total}
              </Text>
            </View>
          </View>
          <View style={[styles.kpiCard, styles.kpiCardWide]}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>
                Maior
                {'\n'}alerta
              </Text>
              <View style={[styles.kpiIcon, { backgroundColor: '#FFF4E5' }]}>
                <Ionicons name="alert-circle" size={16} color={COLORS.warning} />
              </View>
            </View>
            <Text style={styles.kpiValueWide} numberOfLines={2}>
              {resumo.maiorAlerta}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Seus objetivos</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar objetivos"
            placeholderTextColor={COLORS.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {!!searchQuery && (
            <TouchableOpacity style={styles.clearSearchButton} onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filtrosContainer}>
          <TouchableOpacity
            style={[styles.filtroBotao, filtroStatus === 'ativos' && styles.filtroBotaoAtivo]}
            onPress={() => setFiltroStatus('ativos')}
          >
            <Text style={[styles.filtroTexto, filtroStatus === 'ativos' && styles.filtroTextoAtivo]}>
              Ativos ({objetivosAtivosCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filtroBotao, filtroStatus === 'concluidos' && styles.filtroBotaoAtivo]}
            onPress={() => setFiltroStatus('concluidos')}
          >
            <Text
              style={[styles.filtroTexto, filtroStatus === 'concluidos' && styles.filtroTextoAtivo]}
            >
              Concluídos ({objetivosConcluidosCount})
            </Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.emptyStateText}>Carregando objetivos...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={24} color={COLORS.error} />
            <Text style={styles.emptyStateText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={recarregar}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : objetivosProcessados.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={28} color={COLORS.textTertiary} />
            <Text style={styles.emptyStateText}>Nenhum objetivo encontrado.</Text>
          </View>
        ) : (
          <View style={styles.objetivosList}>
            {objetivosProcessados.map((objetivo) => {
              const progressoWidth = `${Math.min(objetivo.percentualRealizadoClamp * 100, 100)}%`;

              return (
                <View key={objetivo.id} style={styles.objetivoCard}>
                  <View style={styles.objetivoHeader}>
                    <View
                      style={[
                        styles.tipoBadge,
                        { backgroundColor: objetivo.tipoVisual?.background },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tipoBadgeText,
                          { color: objetivo.tipoVisual?.color },
                        ]}
                      >
                        {objetivo.tipoVisual?.label}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: objetivo.statusVisual?.background },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: objetivo.statusVisual?.color },
                        ]}
                      >
                        {objetivo.statusVisual?.label}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.objetivoTitulo}>{objetivo.nome}</Text>
                  <Text style={styles.objetivoCategoria}>{objetivo.categoria}</Text>
                  <Text style={styles.objetivoPrazo}>Até {formatarData(objetivo.dataFim)}</Text>

                  <View style={styles.valoresRow}>
                    <View style={styles.valorItem}>
                      <Text style={styles.valorLabel}>Valor alvo</Text>
                      <Text style={styles.valorValue}>
                        {formatarMoedaDetalhada(objetivo.valorAlvo)}
                      </Text>
                    </View>
                    <View style={styles.valorItem}>
                      <Text style={styles.valorLabel}>Realizado no mês</Text>
                      <Text style={styles.valorValue}>
                        {formatarMoedaDetalhada(objetivo.valorRealizado)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.progressoLinha}>
                    <View style={styles.progressoInfo}>
                      <Text style={styles.progressoLabel}>Progresso</Text>
                      <Text style={styles.progressoValor}>
                        {Math.round(objetivo.percentualRealizado * 100)}%
                      </Text>
                    </View>
                    <View style={styles.progressoBarra}>
                      <View
                        style={[
                          styles.progressoFill,
                          {
                            width: progressoWidth,
                            backgroundColor: objetivo.statusVisual?.color,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.insightContainer}>
                    <Text style={styles.insightLabel}>Insight IA</Text>
                    <Text style={styles.insightText}>{objetivo.insight}</Text>
                  </View>

                  <View style={styles.objetivoFooter}>
                    <Text style={styles.objetivoFooterText}>
                      Prioridade {formatarPrioridade(objetivo.prioridade)}
                    </Text>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => navigation.navigate('ObjectivesEdit', { objetivo })}
                    >
                      <Text style={styles.secondaryButtonText}>Detalhes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
      <BotaoFlutuanteAdicionar onPress={() => navigation.navigate('ObjectivesAdd')} />
    </SafeAreaView>
  );
};

export default TelaObjetivos;
