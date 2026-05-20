import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/TelaInicial.styles';
import { useAuth } from '../../contexts/AuthContext';
import { useGerenciarDashboard } from './hooks/useGerenciarDashboard';
import { CardResumo } from './components/CardResumo';
import { ItemCategoria } from './components/ItemCategoria';
import { ItemInstituicao } from './components/ItemInstituicao';
import { GraficoPrevisaoSaldo } from './components/GraficoPrevisaoSaldo';
import { GraficoSaldoDiario } from './components/GraficoSaldoDiario';
import { ModalGraficoPizza } from './components/ModalGraficoPizza';

const TelaInicial = () => {
  const [modalPizzaVisible, setModalPizzaVisible] = useState(false);
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
    saldosPorInstituicao,
    previsaoSaldo,
  } = useGerenciarDashboard(1); // TODO: Pegar ID do usuário logado

  // Loading inicial
  if (loading && !dados) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5BA3FF" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  // Estado de erro
  if (erro && !dados) {
    return (
      <View style={styles.erroContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#E31C23" />
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
            colors={['#5BA3FF']}
            tintColor="#5BA3FF"
          />
        }
      >
        {/* Header com saudação e saldo total */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.saudacao}>
              <Text style={styles.saudacaoTexto}>{obterSaudacao()},</Text>
              <Text style={styles.nomeUsuario}>João</Text>
            </View>
            <TouchableOpacity style={styles.iconeNotificacao}>
              <Ionicons name="notifications-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.saldoTotal}>
            <Text style={styles.saldoLabel}>Saldo Total</Text>
            <Text style={styles.saldoValor}>
              {resumo ? formatarMoeda(resumo.saldoTotal) : 'R$ 0,00'}
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
          {gastosPorCategoria.length > 0 ? (
            gastosPorCategoria.map((categoria) => (
              <ItemCategoria 
                key={categoria.id}
                categoria={categoria}
                formatarMoeda={formatarMoeda}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTexto}>Nenhum gasto registrado neste mês</Text>
            </View>
          )}
        </View>

        {/* Saldo por Instituição - exibe top 3 */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Saldo por Instituição</Text>
          {saldosPorInstituicao.length > 0 ? (
            saldosPorInstituicao.slice(0, 3).map((instituicao) => (
              <ItemInstituicao 
                key={instituicao.id}
                instituicao={instituicao}
                formatarMoeda={formatarMoeda}
                onPress={instituicao.valor > 0 ? () => setModalPizzaVisible(true) : undefined}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTexto}>Nenhuma instituição com saldo</Text>
            </View>
          )}
        </View>

        {/* Saldo Diário - dados reais do back-end */}
        {user?.id && (
          <View style={styles.secao}>
            <GraficoSaldoDiario
              usuarioId={user.id}
              formatarMoeda={formatarMoeda}
            />
          </View>
        )}

        {/* Previsão de Saldo */}
        {previsaoSaldo && (
          <View style={styles.secao}>
            <GraficoPrevisaoSaldo
              dados={previsaoSaldo}
              formatarMoeda={formatarMoeda}
            />
          </View>
        )}

      </ScrollView>

      <ModalGraficoPizza
        visible={modalPizzaVisible}
        onClose={() => setModalPizzaVisible(false)}
        dados={saldosPorInstituicao}
        formatarMoeda={formatarMoeda}
      />
    </View>
  );
};

export default TelaInicial;
