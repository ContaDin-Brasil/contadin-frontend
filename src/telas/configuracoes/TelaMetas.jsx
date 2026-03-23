import React, { useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import { styles } from './styles/TelaMetas.styles';

const METAS_MOCK = [
  {
    id: 'meta-01',
    titulo: 'Reduzir delivery no mes',
    tipo: 'reduzir',
    categoria: 'Alimentacao',
    alvo: 450,
    atual: 320,
    prazo: '30 dias',
    status: 'em_andamento',
  },
  {
    id: 'meta-02',
    titulo: 'Aumentar renda com freelas',
    tipo: 'aumentar',
    categoria: 'Renda extra',
    alvo: 1200,
    atual: 860,
    prazo: '20 dias',
    status: 'em_andamento',
  },
  {
    id: 'meta-03',
    titulo: 'Diminuir transporte por app',
    tipo: 'reduzir',
    categoria: 'Mobilidade',
    alvo: 300,
    atual: 300,
    prazo: 'Concluida',
    status: 'concluida',
  },
];

const SUGESTOES = [
  'Corte pequenos gastos recorrentes',
  'Meta semanal de economia',
  'Aumentar receita recorrente',
  'Trocar assinaturas pouco usadas',
];

const formatarMoeda = (valor) => {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
};

const TelaMetas = ({ navigation }) => {
  const resumo = useMemo(() => {
    const ativas = METAS_MOCK.filter((meta) => meta.status === 'em_andamento').length;
    const concluidas = METAS_MOCK.filter((meta) => meta.status === 'concluida').length;
    const economia = METAS_MOCK
      .filter((meta) => meta.tipo === 'reduzir')
      .reduce((acc, meta) => acc + Math.max(meta.alvo - meta.atual, 0), 0);

    return { ativas, concluidas, economia };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina mostrarBotaoVoltar={true} onVoltar={() => navigation.goBack()}>
        Metas
      </TituloPagina>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroContent}>
              <Text style={styles.heroEyebrow}>IA Contadin</Text>
              <Text style={styles.heroTitle}>Metas inteligentes para seus proximos passos</Text>
              <Text style={styles.heroSubtitle}>
                Crie metas para reduzir gastos ou aumentar receitas e acompanhe o progresso em tempo real.
              </Text>
            </View>
            <View style={styles.heroIconWrapper}>
              <Ionicons name="sparkles" size={28} color="#0B1B36" />
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('GoalsAdd')}
          >
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Criar nova meta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resumoContainer}>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>Ativas</Text>
            <Text style={styles.resumoValue}>{resumo.ativas}</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>Concluidas</Text>
            <Text style={styles.resumoValue}>{resumo.concluidas}</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>Economia estimada</Text>
            <Text style={styles.resumoValue}>{formatarMoeda(resumo.economia)}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Metas em andamento</Text>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Ver todas</Text>
            <Ionicons name="chevron-forward" size={16} color="#0052CC" />
          </TouchableOpacity>
        </View>

        <View style={styles.listaMetas}>
          {METAS_MOCK.map((meta) => {
            const progresso = Math.min(meta.atual / meta.alvo, 1);
            const progressoPct = Math.round(progresso * 100);

            return (
              <View key={meta.id} style={styles.metaCard}>
                <View style={styles.metaHeader}>
                  <View style={styles.metaTag}>
                    <Ionicons
                      name={meta.tipo === 'reduzir' ? 'trending-down' : 'trending-up'}
                      size={16}
                      color={meta.tipo === 'reduzir' ? '#E31C23' : '#00C853'}
                    />
                    <Text style={styles.metaTagText} numberOfLines={1}>
                      {meta.tipo === 'reduzir' ? 'Reduzir gastos' : 'Aumentar receita'}
                    </Text>
                  </View>
                  <Text style={styles.metaPrazo}>{meta.prazo}</Text>
                </View>

                <Text style={styles.metaTitulo}>{meta.titulo}</Text>
                <Text style={styles.metaCategoria}>{meta.categoria}</Text>

                <View style={styles.progressoLinha}>
                  <View style={styles.progressoInfo}>
                    <Text style={styles.progressoLabel}>Progresso</Text>
                    <Text style={styles.progressoValor}>{progressoPct}%</Text>
                  </View>
                  <View style={styles.progressoBarra}>
                    <View style={[styles.progressoFill, { width: `${progressoPct}%` }]} />
                  </View>
                </View>

                <View style={styles.metaFooter}>
                  <View>
                    <Text style={styles.metaFooterLabel}>Atual</Text>
                    <Text style={styles.metaFooterValue}>{formatarMoeda(meta.atual)}</Text>
                  </View>
                  <View>
                    <Text style={styles.metaFooterLabel}>Meta</Text>
                    <Text style={styles.metaFooterValue}>{formatarMoeda(meta.alvo)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('GoalsEdit', { meta })}
                  >
                    <Text style={styles.secondaryButtonText}>Detalhes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sugestoes de metas</Text>
          <Text style={styles.sectionSubtitle}>Prototipo IA</Text>
        </View>

        <View style={styles.sugestoesContainer}>
          {SUGESTOES.map((item) => (
            <View key={item} style={styles.sugestaoChip}>
              <Ionicons name="bulb-outline" size={16} color="#0052CC" />
              <Text style={styles.sugestaoText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TelaMetas;
