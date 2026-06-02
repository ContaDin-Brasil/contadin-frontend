import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import type { DadosPrevisaoSaldo } from '../types/dashboard.types';
import { getStyles } from '../styles/TelaInicial.styles';
import { getColorsByTheme } from '../../../styles/colors';
import { useTheme } from '../../../contexts/ThemeContext';


interface GraficoPrevisaoSaldoProps {
  dados: DadosPrevisaoSaldo;
  formatarMoeda: (valor: number) => string;
}

const { width } = Dimensions.get('window');

const CHART_HEIGHT = 160;
const Y_AXIS_WIDTH = 52;
const N_SECTIONS = 4;

const NOMES_MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

const gerarPeriodos = () => {
  const hoje = new Date();
  return [0, 1, 2].map(offset => ({
    label: NOMES_MESES[(hoje.getMonth() + offset) % 12],
    offset,
  }));
};

const formatarYLabel = (valor: number): string => {
  if (Math.abs(valor) >= 1000) return `R$${(valor / 1000).toFixed(0)}k`;
  return `R$${valor.toFixed(0)}`;
};

export const GraficoPrevisaoSaldo: React.FC<GraficoPrevisaoSaldoProps> = ({
  dados,
  formatarMoeda,
}) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const COLORS = getColorsByTheme(isDarkMode);
  
  const periodos = useMemo(() => gerarPeriodos(), []);
  const [offsetSelecionado, setOffsetSelecionado] = useState(0);

  const pontosFiltrados = useMemo(() => {
    if (!dados?.pontos?.length) return [];
    const hoje = new Date();
    const mesAbsoluto = hoje.getMonth() + offsetSelecionado;
    const anoAlvo = hoje.getFullYear() + Math.floor(mesAbsoluto / 12);
    const mesAlvo = mesAbsoluto % 12;
    // Último momento do último dia do mês alvo
    const limite = new Date(anoAlvo, mesAlvo + 1, 0, 23, 59, 59, 999);

    return dados.pontos.filter(p => {
      const d = new Date(p.dataISO);
      return d <= limite;
    });
  }, [dados, offsetSelecionado]);

  const dadosLinha = useMemo(() => {
    const total = pontosFiltrados.length;
    const step = total <= 15 ? 1 : total <= 30 ? 2 : 5;
    return pontosFiltrados.map((p, i) => ({
      value: p.saldo,
      label: i % step === 0 || i === total - 1 ? p.label : '',
    }));
  }, [pontosFiltrados]);

  // Dimensionamento do gráfico
  const availableWidth = width - Y_AXIS_WIDTH - 48;
  const isFewPoints = dadosLinha.length <= 10;
  const chartSpacing = isFewPoints
    ? Math.floor((availableWidth - 40) / Math.max(dadosLinha.length - 1, 1))
    : 32;
  const chartWidth = isFewPoints ? availableWidth : dadosLinha.length * 32 + 20;

  const saldoInicial = pontosFiltrados[0]?.saldo ?? dados?.saldoAtual ?? 0;
  const saldoFinal = pontosFiltrados[pontosFiltrados.length - 1]?.saldo ?? saldoInicial;
  const tendenciaPositiva = saldoFinal >= saldoInicial;
  const corLinha = tendenciaPositiva ? COLORS.success : COLORS.error;

  const valorMax = useMemo(() => {
    if (!pontosFiltrados.length) return 10000;
    const max = Math.max(...pontosFiltrados.map(p => p.saldo), 0);
    return Math.ceil(max * 1.15 / 1000) * 1000 || 10000;
  }, [pontosFiltrados]);

  const yLabels = useMemo(() => {
    return Array.from({ length: N_SECTIONS + 1 }, (_, i) =>
      formatarYLabel((valorMax / N_SECTIONS) * (N_SECTIONS - i))
    );
  }, [valorMax]);

  const diferencaSaldo = saldoFinal - saldoInicial;
  const corDiferenca = diferencaSaldo >= 0 ? COLORS.success : COLORS.error;
  const periodoLabel = periodos[offsetSelecionado]?.label ?? '';
  const labelDiferenca = diferencaSaldo >= 0 ? 'Ganho previsto' : 'Perda prevista';

  return (
    <View style={styles.containerStyle}>
      {/* Título */}
      <Text style={styles.tituloStyle}>Previsão de Saldo</Text>

      {/* Cards de resumo */}
      <View style={styles.resumoStyle}>
        <View style={styles.resumoItemStyle}>
          <Text style={styles.resumoLabelStyle}>Saldo hoje</Text>
          <Text style={styles.resumoValorStyle}>{formatarMoeda(saldoInicial)}</Text>
        </View>
        <View style={styles.separadorStyle} />
        <View style={styles.resumoItemStyle}>
          <Text style={styles.resumoLabelStyle}>Previsto em {periodoLabel}</Text>
          <Text style={[styles.resumoValorStyle, { color: corLinha }]}>
            {formatarMoeda(saldoFinal)}
          </Text>
        </View>
        <View style={styles.separadorStyle} />
        <View style={styles.resumoItemStyle}>
          <Text style={styles.resumoLabelStyle}>{labelDiferenca}</Text>
          <Text style={[styles.resumoValorStyle, { color: corDiferenca, fontSize: 14 }]}>
            {diferencaSaldo >= 0 ? '+' : ''}{formatarMoeda(diferencaSaldo)}
          </Text>
        </View>
      </View>

      {/* Seletor de período */}
      <View style={styles.periodoContainerStyle}>
        {periodos.map(p => {
          const ativo = offsetSelecionado === p.offset;
          return (
            <TouchableOpacity
              key={p.offset}
              style={[styles.periodoItemStyle, ativo && { backgroundColor: COLORS.secondary }]}
              onPress={() => setOffsetSelecionado(p.offset)}
              activeOpacity={0.7}
            >
              <Text style={[styles.periodoTextoStyle, ativo && { color: COLORS.white }]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Área do gráfico com eixo Y fixo */}
      {dadosLinha.length > 1 ? (
        <View style={{ flexDirection: 'row' }}>
          {/* Eixo Y fixo à esquerda */}
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
              xAxisColor={COLORS.border}
              xAxisLabelTextStyle={{ color: COLORS.textTertiary, fontSize: 9 }}
              dataPointsColor={corLinha}
              dataPointsRadius={4}
              hideRules
              isAnimated
            />
          </ScrollView>
        </View>
      ) : (
        <View style={styles.emptyStyle}>
          <Text style={styles.emptyTextoStyle}>
            Nenhuma transação recorrente ou parcelada em {periodoLabel}
          </Text>
        </View>
      )}

      <Text style={styles.legendaBaseStyle}>
        * Baseado em transações recorrentes e parcelas futuras cadastradas
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