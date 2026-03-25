import React, { useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import { styles } from './styles/TelaMetas.styles';

const METAS_MOCK = [
  {
    id: 'meta-01',
    nome: 'Reduzir delivery no mes',
    categoria: 'Alimentacao',
    valor: 450,
    dataFimMeta: '25/04/2026',
  },
  {
    id: 'meta-02',
    nome: 'Aumentar renda com freelas',
    categoria: 'Renda extra',
    valor: 1200,
    dataFimMeta: '12/04/2026',
  },
  {
    id: 'meta-03',
    nome: 'Diminuir transporte por app',
    categoria: 'Mobilidade',
    valor: 300,
    dataFimMeta: '02/03/2026',
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
    const total = METAS_MOCK.length;
    const valorTotal = METAS_MOCK.reduce((acc, meta) => acc + meta.valor, 0);
    const proximaMeta = METAS_MOCK[0]?.dataFimMeta || '--/--/----';

    return { total, valorTotal, proximaMeta };
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
              <Text style={styles.heroTitle}>Metas inteligentes para seus próximos passos</Text>
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
            <Text style={styles.resumoLabel}>Total de metas</Text>
            <Text style={styles.resumoValue}>{resumo.total}</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>Valor total</Text>
            <Text style={styles.resumoValue}>{formatarMoeda(resumo.valorTotal)}</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>Proximo prazo</Text>
            <Text style={styles.resumoValue}>{resumo.proximaMeta}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Metas cadastradas</Text>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Ver todas</Text>
            <Ionicons name="chevron-forward" size={16} color="#0052CC" />
          </TouchableOpacity>
        </View>

        <View style={styles.listaMetas}>
          {METAS_MOCK.map((meta) => {
            return (
              <View key={meta.id} style={styles.metaCard}>
                <View style={styles.metaHeader}>
                  <View style={styles.metaTag}>
                    <Ionicons name="flag-outline" size={16} color="#0052CC" />
                    <Text style={styles.metaTagText} numberOfLines={1}>Meta de gasto</Text>
                  </View>
                  <Text style={styles.metaPrazo}>Até {meta.dataFimMeta}</Text>
                </View>

                <Text style={styles.metaTitulo}>{meta.nome}</Text>
                <Text style={styles.metaCategoria}>{meta.categoria}</Text>

                <View style={styles.metaFooter}>
                  <View>
                    <Text style={styles.metaFooterLabel}>Valor</Text>
                    <Text style={styles.metaFooterValue}>{formatarMoeda(meta.valor)}</Text>
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
          <Text style={styles.sectionTitle}>Sugestões de metas</Text>
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
