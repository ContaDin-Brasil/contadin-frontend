import React, { useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import BotaoFlutuanteAdicionar from '../../componentes/BotaoFlutuanteAdicionar';
import { COLORS } from '../../styles/colors';
import { styles } from './styles/TelaObjetivos.styles';

const DIA_EM_MS = 24 * 60 * 60 * 1000;

const formatarMoeda = (valor, comSinal = false) => {
  const numero = Number(valor) || 0;
  const texto = `R$ ${numero.toFixed(0).replace('.', ',')}`;
  return comSinal && numero > 0 ? `+${texto}` : texto;
};

const formatarMoedaDetalhada = (valor) => {
  return `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;
};

const formatarData = (dataISO) => {
  if (!dataISO) return '--/--/----';
  const data = new Date(`${dataISO}T00:00:00`);
  if (Number.isNaN(data.getTime())) return dataISO;
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

const clamp = (valor, min = 0, max = 1) => Math.min(max, Math.max(min, valor));

const obterPeriodoAtual = (referencia) => {
  const inicio = new Date(referencia.getFullYear(), referencia.getMonth(), 1);
  const fim = new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0);
  const inicioISO = inicio.toISOString().split('T')[0];
  const fimISO = fim.toISOString().split('T')[0];
  return { inicio, fim, inicioISO, fimISO };
};

const STATUS_VISUAL = {
  'no ritmo': { label: 'No ritmo', color: COLORS.success, background: '#E9F8EF' },
  'atenção': { label: 'Atenção', color: COLORS.warning, background: '#FFF4E5' },
  'estourado': { label: 'Estourado', color: COLORS.error, background: '#FFECEC' },
  'concluído': { label: 'Concluído', color: COLORS.success, background: '#E9F8EF' },
  'abaixo do ritmo': { label: 'Abaixo do ritmo', color: COLORS.warning, background: '#FFF4E5' },
};

const TIPO_VISUAL = {
  LIMITE_GASTO: { label: 'Limitar gasto', color: COLORS.error, background: '#FFECEC' },
  AUMENTO_RECEITA: { label: 'Aumentar receita', color: COLORS.success, background: '#E9F8EF' },
};

const PRIORIDADE_LABELS = {
  ALTA: 'alta',
  MEDIA: 'média',
  BAIXA: 'baixa',
};

const formatarPrioridade = (valor) => {
  if (!valor) return 'média';
  return PRIORIDADE_LABELS[valor] || 'média';
};

const DATA_REFERENCIA = new Date();
const PERIODO_ATUAL = obterPeriodoAtual(DATA_REFERENCIA);

const OBJETIVOS_MOCK = [
  {
    id: 'obj-01',
    nome: 'Gastar no máximo R$ 450 com delivery este mês',
    tipo: 'LIMITE_GASTO',
    categoria: 'Delivery',
    valorAlvo: 450,
    valorRealizado: 350,
    dataInicio: PERIODO_ATUAL.inicioISO,
    dataFim: PERIODO_ATUAL.fimISO,
    prioridade: 'ALTA',
    insight: 'Gastos sobem no fim de semana; planeje 2 refeições caseiras.',
    recomendacao:
      'Você já consumiu 78% do limite de delivery com metade do mês pela frente. Se reduzir 2 pedidos, fecha dentro do objetivo.',
  },
  {
    id: 'obj-02',
    nome: 'Receber pelo menos R$ 800 em freelas este mês',
    tipo: 'AUMENTO_RECEITA',
    categoria: 'Freelas',
    valorAlvo: 800,
    valorRealizado: 280,
    dataInicio: PERIODO_ATUAL.inicioISO,
    dataFim: PERIODO_ATUAL.fimISO,
    prioridade: 'MEDIA',
    insight: 'Sexta e sábado tiveram melhor conversão nas últimas semanas.',
    recomendacao:
      'Seu objetivo de renda extra está em 35%. Sexta e sábado foram seus melhores dias nas últimas semanas.',
  },
  {
    id: 'obj-03',
    nome: 'Fazer R$ 500 extras com renda complementar',
    tipo: 'AUMENTO_RECEITA',
    categoria: 'Renda complementar',
    valorAlvo: 500,
    valorRealizado: 500,
    dataInicio: PERIODO_ATUAL.inicioISO,
    dataFim: PERIODO_ATUAL.fimISO,
    prioridade: 'BAIXA',
    insight: 'Objetivo concluído; mantenha 1 venda por semana.',
  },
  {
    id: 'obj-04',
    nome: 'Gastar no máximo R$ 300 com transporte por app',
    tipo: 'LIMITE_GASTO',
    categoria: 'Transporte',
    valorAlvo: 300,
    valorRealizado: 120,
    dataInicio: PERIODO_ATUAL.inicioISO,
    dataFim: PERIODO_ATUAL.fimISO,
    prioridade: 'MEDIA',
    insight: 'A maioria das corridas é curta; agrupe deslocamentos.',
  },
  {
    id: 'obj-05',
    nome: 'Manter compras no cartão abaixo de R$ 600',
    tipo: 'LIMITE_GASTO',
    categoria: 'Compras',
    valorAlvo: 600,
    valorRealizado: 650,
    dataInicio: PERIODO_ATUAL.inicioISO,
    dataFim: PERIODO_ATUAL.fimISO,
    prioridade: 'ALTA',
    insight: 'O objetivo estourou; foque em itens essenciais até o fechamento.',
  },
];

const calcularPeriodo = (dataInicio, dataFim, referencia) => {
  const inicio = new Date(`${dataInicio}T00:00:00`);
  const fim = new Date(`${dataFim}T23:59:59`);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
    return { percentualPeriodo: 0, diasTotais: 0, diasPassados: 0 };
  }

  const totalMs = Math.max(fim - inicio, DIA_EM_MS);
  const passadosMs = Math.min(Math.max(referencia - inicio, 0), totalMs);
  const percentualPeriodo = clamp(passadosMs / totalMs);
  const diasTotais = Math.max(1, Math.ceil(totalMs / DIA_EM_MS));
  const diasPassados = Math.min(diasTotais, Math.ceil(passadosMs / DIA_EM_MS));

  return { percentualPeriodo, diasTotais, diasPassados };
};

const calcularStatus = (objetivo, percentualPeriodo, percentualRealizado) => {
  const isGasto = objetivo.tipo === 'LIMITE_GASTO';

  if (isGasto) {
    if (objetivo.valorRealizado >= objetivo.valorAlvo) return 'estourado';
    if (percentualRealizado > percentualPeriodo + 0.05) return 'atenção';
    return 'no ritmo';
  }

  if (objetivo.valorRealizado >= objetivo.valorAlvo) return 'concluído';
  if (percentualRealizado >= percentualPeriodo - 0.05) return 'no ritmo';
  return 'abaixo do ritmo';
};

const gerarRecomendacao = (objetivo) => {
  if (!objetivo) return 'Sem recomendações para esta semana.';
  const percentual = Math.round(objetivo.percentualRealizado * 100);

  if (objetivo.tipo === 'LIMITE_GASTO') {
    return `Você já consumiu ${percentual}% do limite de ${objetivo.categoria}. Ajustar pequenos hábitos pode manter o objetivo viável.`;
  }

  return `Seu objetivo de ${objetivo.categoria} está em ${percentual}%. Reforce as ações que trazem mais retorno.`;
};

const TelaObjetivos = ({ navigation }) => {
  const objetivosProcessados = useMemo(() => {
    return OBJETIVOS_MOCK.map((objetivo) => {
      const { percentualPeriodo, diasTotais, diasPassados } = calcularPeriodo(
        objetivo.dataInicio,
        objetivo.dataFim,
        DATA_REFERENCIA,
      );
      const percentualRealizado = objetivo.valorRealizado / objetivo.valorAlvo;
      const percentualRealizadoClamp = clamp(percentualRealizado, 0, 1);
      const status = calcularStatus(objetivo, percentualPeriodo, percentualRealizado);
      const isGasto = objetivo.tipo === 'LIMITE_GASTO';
      const alertaScore = isGasto
        ? Math.max(0, percentualRealizado - percentualPeriodo)
        : Math.max(0, percentualPeriodo - percentualRealizado);
      const alertaLabel = `${objetivo.categoria} ${Math.round(percentualRealizado * 100)}% ${
        isGasto ? 'usado' : 'atingido'
      }`;

      return {
        ...objetivo,
        percentualPeriodo,
        percentualRealizado,
        percentualRealizadoClamp,
        status,
        statusVisual: STATUS_VISUAL[status],
        tipoVisual: TIPO_VISUAL[objetivo.tipo],
        alertaScore,
        alertaLabel,
        diasTotais,
        diasPassados,
      };
    });
  }, []);

  const resumo = useMemo(() => {
    if (!objetivosProcessados.length) {
      return {
        total: 0,
        noRitmo: 0,
        impacto: 0,
        maiorAlerta: '--',
        recomendacao: 'Sem recomendações para esta semana.',
      };
    }

    const impacto = objetivosProcessados.reduce((acc, objetivo) => {
      return acc + Math.max(0, objetivo.valorAlvo - objetivo.valorRealizado);
    }, 0);
    const noRitmo = objetivosProcessados.filter((objetivo) => {
      return objetivo.status === 'no ritmo' || objetivo.status === 'concluído';
    }).length;
    const maiorAlerta = objetivosProcessados.reduce((prev, current) => {
      return current.alertaScore > prev.alertaScore ? current : prev;
    }, objetivosProcessados[0]);

    return {
      total: objetivosProcessados.length,
      noRitmo,
      impacto,
      maiorAlerta: maiorAlerta?.alertaLabel || '--',
      recomendacao: maiorAlerta?.recomendacao || gerarRecomendacao(maiorAlerta),
    };
  }, [objetivosProcessados]);

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
                    <Text style={styles.valorValue}>{formatarMoedaDetalhada(objetivo.valorAlvo)}</Text>
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
      </ScrollView>
      <BotaoFlutuanteAdicionar onPress={() => navigation.navigate('ObjectivesAdd')} />
    </SafeAreaView>
  );
};

export default TelaObjetivos;
