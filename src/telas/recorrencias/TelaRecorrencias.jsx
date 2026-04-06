import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import BotaoFlutuanteAdicionar from '../../componentes/BotaoFlutuanteAdicionar';
import CustomModal from '../../componentes/modais/ModalBase';
import { useGerenciarRecorrencias } from './hooks/useGerenciarRecorrencias';
import { descricaoFrequencia, descricaoTipoLimite, CORES_TIPO, getTipoVisual, isParcelado, CORES_CATEGORIA_RECORRENCIA, ICONES_CATEGORIA_RECORRENCIA } from './constants/constantesRecorrencia';
import { styles } from './styles/TelaRecorrencias.styles';

const TelaRecorrencias = ({ navigation }) => {
  const {
    recorrencias,
    loading,
    error,
    deletarRecorrencia,
    ativarRecorrencia,
  } = useGerenciarRecorrencias();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recorrenciaParaDeletar, setRecorrenciaParaDeletar] = useState(null);
  const [isDeletando, setIsDeletando] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('TODOS'); // TODOS, RECORRÊNCIA, PARCELADO

  const handleVoltar = () => {
    navigation.goBack();
  };

  const handleAdicionarRecorrencia = () => {
    navigation.navigate('AddRecurrency');
  };

  const handleEditarRecorrencia = (recorrencia) => {
    navigation.navigate('EditRecurrency', { recorrenciaId: recorrencia.id });
  };

  const handleDeleteRecorrencia = (recorrencia) => {
    setRecorrenciaParaDeletar(recorrencia);
    setDeleteModalVisible(true);
  };

  // Filtro de recorrências baseado no tipo_limite
  const recorrenciasFiltradas = recorrencias.filter((r) => {
    if (filtroTipo === 'TODOS') return true;
    const tipoVisual = getTipoVisual(r.tipo_limite);
    return tipoVisual === filtroTipo;
  });

  const handleConfirmDelete = async () => {
    if (!recorrenciaParaDeletar) return;

    setIsDeletando(true);
    const sucesso = await deletarRecorrencia(recorrenciaParaDeletar.id);

    if (sucesso) {
      setDeleteModalVisible(false);
      setRecorrenciaParaDeletar(null);
    }
    setIsDeletando(false);
  };

  const handleAtivarRecorrencia = async (recorrencia) => {
    await ativarRecorrencia(recorrencia.id);
  };

  const RecorrenciaCard = ({ recorrencia }) => {
    const tipoVisual = getTipoVisual(recorrencia.tipo_limite);
    const corTipoVisual = CORES_CATEGORIA_RECORRENCIA[tipoVisual];
    const iconTipoVisual = ICONES_CATEGORIA_RECORRENCIA[tipoVisual];

    return (
      <TouchableOpacity
        style={styles.recorrenciaCard}
        onPress={() => handleEditarRecorrencia(recorrencia)}
      >
        <View style={styles.recorrenciaCardHorizontal}>
          <View style={styles.recorrenciaContent}>
            <View style={styles.recorrenciaHeader}>
              <Text style={styles.recorrenciaTitle}>{recorrencia.descricao}</Text>
              <View style={styles.badgesContainer}>
                {/* Badge de RECORRÊNCIA vs PARCELADO */}
                <View
                  style={[
                    styles.tipoBadge,
                    { backgroundColor: corTipoVisual },
                  ]}
                >
                  <Ionicons name={iconTipoVisual} size={14} color="#FFF" />
                  <Text style={styles.tipoBadgeText}>{tipoVisual}</Text>
                </View>

                {/* Badge de Status (Ativa/Inativa) */}
                <View
                  style={[
                    styles.statusBadge,
                    recorrencia.ativo
                      ? styles.statusBadgeAtivo
                      : styles.statusBadgeInativo,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      recorrencia.ativo
                        ? styles.statusBadgeTextoAtivo
                        : styles.statusBadgeTextoInativo,
                    ]}
                  >
                    {recorrencia.ativo ? 'Ativa' : 'Inativa'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.recorrenciaDetails}>
              <View style={styles.detalheLinha}>
                <Text style={styles.detalheLabel}>Frequência:</Text>
                <Text style={styles.detalheValue}>
                  {descricaoFrequencia(recorrencia.frequencia, recorrencia.intervalo)}
                </Text>
              </View>

              <View style={styles.detalheLinha}>
                <Text style={styles.detalheLabel}>Limite:</Text>
                <Text style={styles.detalheValue}>
                  {descricaoTipoLimite(
                    recorrencia.tipo_limite,
                    recorrencia.data_fim,
                    recorrencia.qtd_ocorrencias
                  )}
                </Text>
              </View>

              <View style={styles.detalheLinha}>
                <Text style={styles.detalheLabel}>Desde:</Text>
                <Text style={styles.detalheValue}>
                  {new Date(recorrencia.dia_inicio).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.recorrenciaValor,
                recorrencia.tipo === 'GASTO'
                  ? styles.recorrenciaValorGasto
                  : styles.recorrenciaValorReceita,
              ]}
            >
              {recorrencia.tipo === 'GASTO' ? '-' : '+'}
              {' R$ '}
              {recorrencia.valor.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View style={styles.acoesBotoes}>
            {!recorrencia.ativo && (
              <TouchableOpacity
                style={styles.botaoAcao}
                onPress={() => handleAtivarRecorrencia(recorrencia)}
              >
                <Ionicons name="checkmark-circle" size={20} color="#51CF66" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.botaoAcao, styles.botaoEditar]}
              onPress={() => handleEditarRecorrencia(recorrencia)}
            >
              <Ionicons name="pencil-outline" size={20} color="#5BA3FF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botaoAcao, styles.boraoDeletar]}
              onPress={() => handleDeleteRecorrencia(recorrencia)}
            >
              <Ionicons name="trash-outline" size={20} color="#E31C23" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <TituloPagina mostrarBotaoVoltar={true} onVoltar={handleVoltar}>
          Recorrências
        </TituloPagina>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5BA3FF" />
          <Text style={styles.loadingText}>Carregando recorrências...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina mostrarBotaoVoltar={true} onVoltar={handleVoltar}>
        Recorrências
      </TituloPagina>

      {/* Filtro de Tipo */}
      <View style={styles.filtrosContainer}>
        {['TODOS', 'RECORRÊNCIA', 'PARCELADO'].map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[
              styles.filtroButton,
              filtroTipo === tipo && styles.filtroButtonAtivo,
            ]}
            onPress={() => setFiltroTipo(tipo)}
          >
            <Text
              style={[
                styles.filtroButtonText,
                filtroTipo === tipo && styles.filtroButtonTextoAtivo,
              ]}
            >
              {tipo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && (
        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <Text style={{ color: '#E31C23', textAlign: 'center' }}>
            Erro: {error}
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {recorrenciasFiltradas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="repeat-outline"
              size={64}
              color="#CCCCCC"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              {recorrencias.length === 0
                ? 'Nenhuma recorrência criada'
                : `Nenhuma ${filtroTipo.toLowerCase()} encontrada`}
            </Text>
            <Text style={styles.emptySubtext}>
              {recorrencias.length === 0
                ? 'Clique no botão abaixo para criar sua primeira recorrência'
                : 'Tente outro filtro'}
            </Text>
          </View>
        ) : (
          <View>
            {recorrenciasFiltradas.map((recorrencia) => (
              <RecorrenciaCard key={recorrencia.id} recorrencia={recorrencia} />
            ))}
          </View>
        )}
      </ScrollView>

      <BotaoFlutuanteAdicionar onPress={handleAdicionarRecorrencia} />

      <CustomModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="Deletar Recorrência"
        onConfirm={handleConfirmDelete}
        confirmText="Deletar"
        cancelText="Cancelar"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Tem certeza que deseja deletar a recorrência{' '}
            <Text style={{ fontWeight: 'bold' }}>
              "{recorrenciaParaDeletar?.descricao}"
            </Text>
            ?
          </Text>
          <Text style={styles.modalWarning}>
            ⚠️ Esta ação não pode ser desfeita.
          </Text>
        </View>
      </CustomModal>
    </SafeAreaView>
  );
};

export default TelaRecorrencias;
