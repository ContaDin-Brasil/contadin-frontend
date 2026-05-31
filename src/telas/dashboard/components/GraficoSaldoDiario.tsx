import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { buscarSaldoDiario } from '../../../api/services/dashboardService';
import type { SaldoDiario } from '../types/dashboard.types';
import { getStyles } from '../styles/TelaInicial.styles';
import { getColorsByTheme } from '../../../styles/colors';
import { useTheme } from '../../../contexts/ThemeContext';

interface GraficoSaldoDiarioProps {
  usuarioId: string | number;
  formatarMoeda: (valor: number) => string;
  refreshKey?: number;
}

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 160;
const Y_AXIS_WIDTH = 52;
const N_SECTIONS = 4;
const CHART_SPACING = 28;
const NOMES_MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

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
  refreshKey,
}) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const COLORS = getColorsByTheme(isDarkMode);
  
  // Cores dinâmicas baseadas no tema
  const COR_REALIZADO_POS = COLORS.success;
  const COR_REALIZADO_NEG = COLORS.error;
  const COR_PROJECAO = COLORS.primary;
  
  const [cache, setCache] = useState<Record<number, SaldoDiario[]>>({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mesVisivel, setMesVisivel] = useState(0);
  const mesVisivelRef = useRef(0);
  const scrollRef = useRef<ScrollView>(null);

  const periodos = useMemo(() => [0, 1, 2].map(offset => ({ offset, ...periodoParaDatas(offset) })), []);
  const hojeISO = toISO(new Date());

  const fetchDados = useCallback(async (offset: number) => {
    try {
      const { inicio, fim } = periodoParaDatas(offset);
      const dados = await buscarSaldoDiario(usuarioId, inicio, fim);
      setCache(prev => ({ ...prev, [offset]: dados }));
    } catch {
      if (offset === 0) setErro('Não foi possível carregar o saldo.');
    }
  }, [usuarioId]);

  // Carrega os 3 meses em paralelo na montagem
  useEffect(() => {
    setLoading(true);
    setErro(null);
    Promise.all([0, 1, 2].map(o => fetchDados(o))).finally(() => setLoading(false));
  }, [fetchDados]);

  // Recarrega mês atual ao receber foco
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    fetchDados(0);
  }, [refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Limites de scroll por mês (índice cumulativo de pontos) ──────────────
  const limitesMeses = useMemo(() => {
    let cumulative = 0;
    return [0, 1, 2].map(i => {
      const start = cumulative;
      cumulative += cache[i]?.length ?? 0;
      return start;
    });
  }, [cache]);

  // ── Navegação por aba: rola o gráfico até o mês selecionado ─────────────
  const handleSelecionarMes = useCallback((offset: number) => {
    const x = limitesMeses[offset] * CHART_SPACING;
    if (!scrollRef.current) return;
    if (Platform.OS === 'web') {
      const node = (scrollRef.current as any).getScrollableNode?.();
      node?.scrollTo?.({ left: x, behavior: 'smooth' });
    } else {
      scrollRef.current.scrollTo({ x, animated: true });
    }
  }, [limitesMeses]);

  // ── Detecção do mês visível pelo scroll ───────────────────────────────────
  const handleScroll = useCallback((event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    let novoMes = 0;
    for (let i = limitesMeses.length - 1; i >= 0; i--) {
      if (cache[i]?.length && x >= limitesMeses[i] * CHART_SPACING - CHART_SPACING / 2) {
        novoMes = i;
        break;
      }
    }
    if (novoMes !== mesVisivelRef.current) {
      mesVisivelRef.current = novoMes;
      setMesVisivel(novoMes);
    }
  }, [limitesMeses, cache]);

  // ── KPIs calculados por mês ───────────────────────────────────────────────
  const kpis = useMemo(() => {
    const dadosMes = cache[mesVisivel] ?? [];
    if (!dadosMes.length) return null;
    const periodo = periodos[mesVisivel];

    if (mesVisivel === 0) {
      const dadosPassado = dadosMes.filter(d => d.data <= hojeISO);
      const saldoHoje = dadosPassado.length > 0
        ? Number(dadosPassado[dadosPassado.length - 1].saldoFinal)
        : Number(dadosMes[0].saldoInicial);
      const saldoPrevisto = Number(dadosMes[dadosMes.length - 1].saldoFinal);
      return {
        labelSaldo: 'Saldo hoje',
        valorSaldo: saldoHoje,
        labelPrevisto: `Previsto em ${periodo.label}`,
        valorPrevisto: saldoPrevisto,
        variacao: saldoPrevisto - saldoHoje,
        temHistorico: dadosPassado.length > 0,
      };
    }

    // Meses futuros: ganho/perda do mês inteiro
    const saldoInicio = Number(dadosMes[0].saldoInicial);
    const saldoPrevisto = Number(dadosMes[dadosMes.length - 1].saldoFinal);
    return {
      labelSaldo: `Início de ${periodo.label}`,
      valorSaldo: saldoInicio,
      labelPrevisto: `Previsto em ${periodo.label}`,
      valorPrevisto: saldoPrevisto,
      variacao: saldoPrevisto - saldoInicio,
      temHistorico: false,
    };
  }, [cache, mesVisivel, hojeISO, periodos]);

  const variacaoPositiva = (kpis?.variacao ?? 0) >= 0;

  // Cor base do mês 0 (para colorir os pontos realizados)
  const mes0Direcao = useMemo(() => {
    const d = cache[0] ?? [];
    if (!d.length) return true;
    const passado = d.filter(x => x.data <= hojeISO);
    const saldoHoje = passado.length > 0 ? Number(passado[passado.length - 1].saldoFinal) : Number(d[0].saldoInicial);
    return Number(d[d.length - 1].saldoFinal) >= saldoHoje;
  }, [cache, hojeISO]);

  // ── Dados combinados dos 3 meses ─────────────────────────────────────────
  const dadosLinha = useMemo(() => {
    if (!cache[0]) return [];
    const points: any[] = [];

    for (let offset = 0; offset <= 2; offset++) {
      const dadosMes = cache[offset];
      if (!dadosMes || dadosMes.length === 0) break;

      const total = dadosMes.length;
      const step = total <= 10 ? 1 : total <= 20 ? 2 : 4;

      dadosMes.forEach((d, i) => {
        const futuro = d.data > hojeISO;
        const [, mes, dia] = d.data.split('-');

        // Label: nome do mês no primeiro ponto de meses futuros; data nos demais
        let label = '';
        if (offset > 0 && i === 0) {
          label = periodos[offset].label;
        } else if (i % step === 0 || i === total - 1) {
          label = `${dia}/${mes}`;
        }

        points.push({
          value: Number(d.saldoFinal),
          label,
          dataPointColor: futuro
            ? COR_PROJECAO
            : (mes0Direcao ? COR_REALIZADO_POS : COR_REALIZADO_NEG),
          dataPointRadius: futuro ? 2 : 4,
        });
      });
    }

    return points;
  }, [cache, hojeISO, periodos, mes0Direcao]);

  // Cor da linha muda conforme o mês visível
  const corLinha = mesVisivel === 0
    ? (mes0Direcao ? COR_REALIZADO_POS : COR_REALIZADO_NEG)
    : COR_PROJECAO;

  // ── Escala Y ──────────────────────────────────────────────────────────────
  const valorMax = useMemo(() => {
    if (!dadosLinha.length) return 5000;
    const max = Math.max(...dadosLinha.map(d => d.value), 0);
    return Math.ceil(max * 1.15 / 500) * 500 || 5000;
  }, [dadosLinha]);

  const yLabels = useMemo(() =>
    Array.from({ length: N_SECTIONS + 1 }, (_, i) =>
      formatarYLabel((valorMax / N_SECTIONS) * (N_SECTIONS - i))
    ), [valorMax]);

  const availableWidth = width - Y_AXIS_WIDTH - 48;
  const chartWidth = Math.max(dadosLinha.length * CHART_SPACING + 20, availableWidth);

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.tituloStyle}>Saldo Diário</Text>

      {/* KPIs */}
      <View style={styles.resumoStyle}>
        <View style={styles.resumoItemStyle}>
          <Text style={styles.resumoLabelStyle}>{kpis?.labelSaldo ?? 'Saldo hoje'}</Text>
          <Text style={styles.resumoValorStyle}>
            {kpis ? formatarMoeda(kpis.valorSaldo) : '...'}
          </Text>
        </View>
        <View style={styles.separadorStyle} />
        <View style={styles.resumoItemStyle}>
          <Text style={styles.resumoLabelStyle}>{kpis?.labelPrevisto ?? 'Previsto'}</Text>
          <Text style={[styles.resumoValorStyle, { color: corLinha }]}>
            {kpis ? formatarMoeda(kpis.valorPrevisto) : '...'}
          </Text>
        </View>
        <View style={styles.separadorStyle} />
        <View style={styles.resumoItemStyle}>
          <Text style={styles.resumoLabelStyle}>
            {variacaoPositiva ? 'Ganho previsto' : 'Perda prevista'}
          </Text>
          <Text style={[styles.resumoValorStyle, { color: variacaoPositiva ? COR_REALIZADO_POS : COR_REALIZADO_NEG, fontSize: 13 }]}>
            {kpis ? `${kpis.variacao >= 0 ? '+' : ''}${formatarMoeda(kpis.variacao)}` : '...'}
          </Text>
        </View>
      </View>

      {/* Abas de mês */}
      <View style={styles.periodoContainerStyle}>
        {periodos.map(p => {
          const ativo = mesVisivel === p.offset;
          return (
            <TouchableOpacity
              key={p.offset}
              style={[styles.periodoItemStyle, ativo && { backgroundColor: COLORS.secondary }]}
              onPress={() => handleSelecionarMes(p.offset)}
              activeOpacity={0.7}
            >
              <Text style={[styles.periodoTextoStyle, ativo && { color: COLORS.white }]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Gráfico */}
      {loading && !cache[0] ? (
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
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            style={{ flex: 1 }}
            onScroll={handleScroll}
            scrollEventThrottle={80}
          >
            <LineChart
              data={dadosLinha}
              width={chartWidth}
              spacing={CHART_SPACING}
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
              xAxisColor={COLORS.border}
              xAxisLabelTextStyle={{ color: COLORS.textTertiary, fontSize: 9 }}
              dataPointsRadius={4}
              hideRules
              isAnimated={false}
            />
          </ScrollView>
        </View>
      ) : (
        <View style={styles.emptyStyle}>
          <Text style={styles.emptyTextoStyle}>Nenhum dado de saldo disponível</Text>
        </View>
      )}

      {/* Legenda */}
      {dadosLinha.length > 1 && (
        <View style={legendaLinhaStyle}>
          {mesVisivel === 0 && kpis?.temHistorico && (
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
