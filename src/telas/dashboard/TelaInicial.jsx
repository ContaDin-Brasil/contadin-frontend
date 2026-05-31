import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getStyles } from './styles/TelaInicial.styles';
import { getColorsByTheme } from '../../styles/colors';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useGerenciarDashboard } from './hooks/useGerenciarDashboard';
import { CardResumo } from './components/CardResumo';
import { ItemCategoria } from './components/ItemCategoria';
import { GraficoSaldoDiario } from './components/GraficoSaldoDiario';
import { ModalGraficoCategorias } from './components/ModalGraficoCategorias';
import { EmptyStateTransacoes } from './components/EmptyStateTransacoes';

const TelaInicial = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const COLORS = getColorsByTheme(isDarkMode);
  const navigation = useNavigation();
  
  const [modalGraficoCategoriasVisible, setModalGraficoCategoriasVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [bloquearRenderizacao, setBloquearRenderizacao] = useState(true);
  const { user } = useAuth();

  const {
    dados,
    loading,
    erro,
    atualizando,
    atualizarDados,
    obterSaudacao,
    formatarMoeda,
    resumo,
    gastosPorCategoria,
    saldoConsolidado,
  } = useGerenciarDashboard(); // ✅ Sem parâmetro - usa user.id do contexto

  // Atualizar dados e gráfico quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      let ativo = true;

      setBloquearRenderizacao(true);

      Promise.resolve(atualizarDados()).finally(() => {
        if (ativo) {
          setBloquearRenderizacao(false);
          setRefreshKey(prev => prev + 1);
        }
      });

      return () => {
        ativo = false;
      };
    }, [atualizarDados])
  );

  // Loading inicial
  if (bloquearRenderizacao || (loading && !dados)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  // Estado de erro
  if (erro && !dados) {
    return (
      <View style={styles.erroContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
        <Text style={styles.erroTexto}>{erro}</Text>
        <TouchableOpacity 
          style={styles.botaoTentarNovamente}
          onPress={atualizarDados}
        >
          <Text style={styles.botaoTentarNovamenteTexto}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ Empty State - quando não há transações cadastradas
  const temTransacoes = resumo && (resumo.receitaTotal > 0 || resumo.gastoTotal > 0);
  
  if (!temTransacoes && !loading) {
    return (
      <View style={styles.container}>
        <EmptyStateTransacoes
          onAdicionarTransacao={() => navigation.navigate('Transacoes', { screen: 'AdicionarTransacao' })}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={atualizarDados}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header com saudação e saldo total */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.saudacao}>
              <Text style={styles.saudacaoTexto}>{obterSaudacao()},</Text>
              <Text style={styles.nomeUsuario}>{user?.nome || 'Usuário'}</Text>
            </View>
          </View>

          <View style={styles.saldoTotal}>
            <Text style={styles.saldoLabel}>Saldo Atual</Text>
            <Text style={styles.saldoValor}>
              {saldoConsolidado !== null
                ? formatarMoeda(saldoConsolidado)
                : resumo
                  ? formatarMoeda(resumo.saldoTotal)
                  : 'R$ 0,00'}
            </Text>
          </View>

          <View style={styles.cardsResumo}>
            <CardResumo 
              tipo="receita" 
              valor={resumo?.receitaTotal || 0} 
              formatarMoeda={formatarMoeda}
              mes={resumo?.mesAtual}
            />
            <CardResumo 
              tipo="gasto" 
              valor={resumo?.gastoTotal || 0} 
              formatarMoeda={formatarMoeda}
              mes={resumo?.mesAtual}
            />
          </View>
        </View>

        {/* Gastos por Categoria */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Gastos por Categoria</Text>
          {(() => {
            if (gastosPorCategoria && gastosPorCategoria.length > 0) {
              return gastosPorCategoria.map((categoria) => (
                <ItemCategoria 
                  key={categoria.id}
                  categoria={categoria}
                  formatarMoeda={formatarMoeda}
                  onPress={categoria.valor > 0 ? () => setModalGraficoCategoriasVisible(true) : undefined}
                />
              ));
            }
            return (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTexto}>Nenhum gasto registrado neste mês</Text>
              </View>
            );
          })()}
        </View>

        {/* Saldo Diário */}
        {user?.id && (
          <View style={styles.secao}>
            <GraficoSaldoDiario
              usuarioId={user.id}
              formatarMoeda={formatarMoeda}
              refreshKey={refreshKey}
            />
          </View>
        )}



      </ScrollView>

      <ModalGraficoCategorias
        visible={modalGraficoCategoriasVisible}
        onClose={() => setModalGraficoCategoriasVisible(false)}
        dados={gastosPorCategoria}
        formatarMoeda={formatarMoeda}
      />
    </View>
  );
};

export default TelaInicial;
