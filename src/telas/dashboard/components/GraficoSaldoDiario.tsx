import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { buscarSaldoDiario } from '../../../api/services/dashboardService';
import type { SaldoDiario } from '../types/dashboard.types';
import { styles } from '../styles/TelaInicial.styles';
import { COLORS } from '../../../styles/colors';

interface GraficoSaldoDiarioProps {
  usuarioId: string | number;
  formatarMoeda: (valor: number) => string;
}

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 160;
const Y_AXIS_WIDTH = 52;
const N_SECTIONS = 4;
const NOMES_MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const COR_REALIZADO_POS = '#51CF66';
const COR_REALIZADO_NEG = '#FF6B6B';
const COR_PROJECAO = '#5BA3FF';

const toISO = (d: Date) => d.toISOString().split('T')[0];

const formatarYLabel = (valor: number): string => {
  if (Math.abs(valor) >= 1000) return `R$${(valor / 1000).toFixed(0)}k`;
  return `R$${valor.toFixed(0)}`;
};

const periodoParaDatas = (offset: number) => {
  const hoje = new Date();
  const mesAbsoluto = hoje.getMonth() + offset;
  const anoAlvo = hoje.getFullYear() + Math.floor(mesAbsoluto / 12);
  const mesAlvo = mesAbsoluto % 12;
  const inicio = new Date(anoAlvo, mesAlvo, 1);
  const fim = new Date(anoAlvo, mesAlvo + 1, 0);
  return { inicio: toISO(inicio), fim: toISO(fim), label: NOMES_MESES[mesAlvo] };
};

export const GraficoSaldoDiario: React.FC<GraficoSaldoDiarioProps> = ({
  usuarioId,
  formatarMoeda,
}) => {
  const [offsetSelecionado, setOffsetSelecionado] = useState(0);
  const [cache, setCache] = useState<Record<number, SaldoDiario[]>>({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const periodos = useMemo(() => [0, 1, 2].map(offset => ({ offset, ...periodoParaDatas(offset) })), []);

  const carregarPeriodo = useCallback(async (offset: number) => {
    if (cache[offset] !== undefined) return;
    setLoading(true);
    setErro(null);
    try {
      const { inicio, fim } = periodoParaDatas(offset);
      const dados = await buscarSaldoDiario(usuarioId, inicio, fim);
      setCache(prev => ({ ...prev, [offset]: dados }));
    } catch {
      setErro('Não foi possível carregar o saldo.');
    } finally {
      setLoading(false);
    }
  }, [usuarioId, cache]);

  useEffect(() => { carregarPeriodo(0); }, []);

  const handleSelecionarPeriodo = (offset: number) => {
    setOffsetSelecionado(offset);
    carregarPeriodo(offset);
  };

  const dados: SaldoDiario[] = cache[offsetSelecionado] ?? [];
  const periodoAtual = periodos[offsetSelecionado];
  const hojeISO = toISO(new Date());
  const ehMesAtual = offsetSelecionado === 0;

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const dadosPassado = dados.filter(d => d.data <= hojeISO);
  const saldoHoje = dadosPassado.length > 0
    ? Number(dadosPassado[dadosPassado.length - 1].saldoFinal)
    : (dados.length > 0 ? Number(dados[0].saldoInicial) : 0);

  const saldoProjetado = dados.length > 0 ? Number(dados[dados.length - 1].saldoFinal) : 0;
  const variacao = saldoProjetado - saldoHoje;
  const variacaoPositiva = variacao >= 0;
  const corVariacao = variacaoPositiva ? COR_REALIZADO_POS : COR_REALIZADO_NEG;

  // ── Linha do gráfico ─────────────────────────────────────────────────────
  const dadosLinha = useMemo(() => {
    if (!dados.length) return [];
    const total = dados.length;
    const step = total <= 10 ? 1 : total <= 20 ? 2 : 4;
    return dados.map((d, i) => {
      const futuro = d.data > hojeISO;
      const [, mes, dia] = d.data.split('-');
      return {
        value: Number(d.saldoFinal),
        label: i % step === 0 || i === total - 1 ? `${dia}/${mes}` : '',
        dataPointColor: futuro ? COR_PROJECAO : (variacaoPositiva ? COR_REALIZADO_POS : COR_REALIZADO_NEG),
        dataPointRadius: futuro ? 2 : 4,
      };
    });
  }, [dados, hojeISO, variacaoPositiva]);

  // cor da linha: azul se só projeção, verde/vermelho se tem histórico
  const corLinha = ehMesAtual || dadosPassado.length > 0
    ? (variacaoPositiva ? COR_REALIZADO_POS : COR_REALIZADO_NEG)
    : COR_PROJECAO;

  // ── Escala Y ──────────────────────────────────────────────────────────────
  const valorMax = useMemo(() => {
    if (!dadosLinha.length) return 5000;
    const max = Math.max(...dadosLinha.map(d => d.value), 0);
    return Math.ceil(max * 1.15 / 500) * 500 || 5000;
  }, [dadosLinha]);

  const yLabels = useMemo(() =>
    Array.from({ length: N_SECTIONS + 1 }, (_, i) =>
      formatarYLabel((valorMax / N_SECTIONS) * (N_SECTIONS - i)),
    ), [valorMax]);

  // ── Largura do gráfico ────────────────────────────────────────────────────
  const availableWidth = width - Y_AXIS_WIDTH - 48;
  const isFewPoints = dadosLinha.length <= 10;
  const chartSpacing = isFewPoints
    ? Math.floor((availableWidth - 40) / Math.max(dadosLinha.length - 1, 1))
    : 32;
  const chartWidth = isFewPoints ? availableWidth : dadosLinha.length * 32 + 20;

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.tituloStyle}>Saldo Diário</Text>

      {/* KPIs */}
      <View style={styles.resumoStyle}>
        <View style={styles.resumoItemStyle}>
          <Text style={styles.resumoLabelStyle}>
            {ehMesAtual ? 'Saldo hoje' : `Início de ${periodoAtual?.label}`}
          </Text>
          <Text style={styles.resumoValorStyle}>{formatarMoeda(saldoHoje)}</Text>
        </View>
        <View style={styles.separadorStyle} />
        <View style={styles.resumoItemStyle}>
          <Text style={styles.resumoLabelStyle}>Previsto em {periodoAtual?.label}</Text>
          <Text style={[styles.resumoValorStyle, { color: corLinha }]}>
            {formatarMoeda(saldoProjetado)}
          </Text>
        </View>
        <View style={styles.separadorStyle} />
        <View style={styles.resumoItemStyle}>
          <Text style={styles.resumoLabelStyle}>
            {variacaoPositiva ? 'Ganho previsto' : 'Perda prevista'}
          </Text>
          <Text style={[styles.resumoValorStyle, { color: corVariacao, fontSize: 13 }]}>
            {variacao >= 0 ? '+' : ''}{formatarMoeda(variacao)}
          </Text>
        </View>
      </View>

      {/* Seletor de mês */}
      <View style={styles.periodoContainerStyle}>
        {periodos.map(p => {
          const ativo = offsetSelecionado === p.offset;
          return (
            <TouchableOpacity
              key={p.offset}
              style={[styles.periodoItemStyle, ativo && { backgroundColor: '#569FFE' }]}
              onPress={() => handleSelecionarPeriodo(p.offset)}
              activeOpacity={0.7}
            >
              <Text style={[styles.periodoTextoStyle, ativo && { color: '#FFFFFF' }]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Gráfico */}
      {loading && !cache[offsetSelecionado] ? (
        <View style={styles.emptyStyle}>
          <ActivityIndicator color={COLORS.primaryLight} />
        </View>
      ) : erro ? (
        <View style={styles.emptyStyle}>
          <Text style={styles.emptyTextoStyle}>{erro}</Text>
        </View>
      ) : dadosLinha.length > 1 ? (
        <View style={{ flexDirection: 'row' }}>
          <View style={yAxisContainerStyle}>
            {yLabels.map((label, i) => (
              <Text key={i} style={styles.yAxisLabelStyle}>{label}</Text>
            ))}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            style={{ flex: 1 }}
          >
            <LineChart
              data={dadosLinha}
              width={chartWidth}
              spacing={chartSpacing}
              initialSpacing={20}
              height={CHART_HEIGHT}
              color={corLinha}
              thickness={2.5}
              startFillColor={corLinha}
              endFillColor={corLinha}
              startOpacity={0.22}
              endOpacity={0.02}
              areaChart
              curved
              noOfSections={N_SECTIONS}
              maxValue={valorMax}
              yAxisLabelWidth={0}
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor="#E0E0E0"
              xAxisLabelTextStyle={{ color: '#888888', fontSize: 9 }}
              dataPointsRadius={4}
              hideRules
              isAnimated
            />
          </ScrollView>
        </View>
      ) : (
        <View style={styles.emptyStyle}>
          <Text style={styles.emptyTextoStyle}>
            Nenhum dado de saldo para {periodoAtual?.label}
          </Text>
        </View>
      )}

      {/* Legenda realizado vs projeção */}
      {dadosLinha.length > 1 && (
        <View style={legendaLinhaStyle}>
          {ehMesAtual && dadosPassado.length > 0 && (
            <View style={legendaItemStyle}>
              <View style={[legendaCorStyle, { backgroundColor: corLinha }]} />
              <Text style={styles.yAxisLabelStyle}>Realizado</Text>
            </View>
          )}
          <View style={legendaItemStyle}>
            <View style={[legendaCorStyle, { backgroundColor: COR_PROJECAO }]} />
            <Text style={styles.yAxisLabelStyle}>Projeção</Text>
          </View>
        </View>
      )}

      <Text style={styles.legendaBaseStyle}>
        * Projeção baseada em transações recorrentes e parceladas
      </Text>
    </View>
  );
};

const yAxisContainerStyle: any = {
  width: Y_AXIS_WIDTH,
  height: CHART_HEIGHT,
  justifyContent: 'space-between',
  paddingBottom: 20,
  paddingRight: 4,
};

const legendaLinhaStyle: any = {
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 16,
  marginTop: 8,
};

const legendaItemStyle: any = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
};

const legendaCorStyle: any = {
  width: 8,
  height: 8,
  borderRadius: 4,
};
