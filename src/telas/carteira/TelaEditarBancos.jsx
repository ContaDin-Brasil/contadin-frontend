import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import TituloPagina from '../../componentes/TituloPagina';
import InstitutionSelectionModal from '../../componentes/modais/ModalSelecaoInstituicao';
import AddCustomInstitutionModal from '../../componentes/modais/ModalAdicionarInstituicao';
import ModalEditarInstituicao from '../../componentes/modais/ModalEditarInstituicao';
import ModalConfirmDelete from '../../componentes/modais/ModalConfirmDelete';
import ModalAviso from '../../componentes/modais/ModalAviso';
import { useEditarBancos } from './hooks/useEditarInstituicoes';
import { getLogoByName } from '../../componentes/modais/logosInstituicoes';
import { getStyles } from './styles/TelaEditarBancos.styles';
import { getColorsByTheme } from '../../styles/colors';
import { useTheme } from '../../contexts/ThemeContext';

const EditBanksScreen = ({ navigation }) => {
  const editor = useEditarBancos();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const COLORS = getColorsByTheme(isDarkMode);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [bankDeletando, setBankDeletando] = React.useState(null);
  const [isDeletando, setIsDeletando] = React.useState(false);
  const [modalAviso, setModalAviso] = React.useState({ visible: false, titulo: '', mensagem: '' });

  const fecharAviso = () => setModalAviso((prev) => ({ ...prev, visible: false }));
  const mostrarAviso = (titulo, mensagem) => setModalAviso({ visible: true, titulo, mensagem });

  // Recarrega bancos quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      editor.carregarBancos(true); // forceRefresh=true para sempre buscar dados frescos
    }, [])
  );

  const handleDeleteConfirm = (bank) => {
    setBankDeletando(bank);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!bankDeletando) return;

    setIsDeletando(true);
    try {
      await editor.handleDelete(bankDeletando.id);
      setDeleteModalVisible(false);
      setBankDeletando(null);
    } catch (error) {
      console.error('Erro ao deletar banco:', error);
      mostrarAviso('Erro', 'Não foi possível deletar o banco');
    } finally {
      setIsDeletando(false);
    }
  };

  const renderIcon = (text, color, institutionName) => {
    const logo = getLogoByName(institutionName);
    
    return (
      <View style={[styles.iconContainer, { backgroundColor: logo ? COLORS.background : color }]}>
        {logo ? (
          <Image 
            source={logo} 
            style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 8 }}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.iconText}>{text}</Text>
        )}
      </View>
    );
  };

  // Mostra loading
  if (editor.loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.header}>
          <TituloPagina 
            mostrarBotaoVoltar={true} 
            onVoltar={() => navigation.goBack()}
            style={{ marginTop: 0, marginBottom: 0 }}
          >
            Editar Bancos
          </TituloPagina>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textSecondary }}>Carregando bancos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina 
        mostrarBotaoVoltar={true} 
        onVoltar={() => navigation.goBack()}
      >
        Editar Bancos
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.textPrimary} />
          <View style={styles.sectionTitleText}>
            <Text style={styles.sectionTitle}>Contas Bancárias</Text>
          </View>
        </View>

        <View style={styles.banksList}>
          {editor.banks.map((bank) => (
            <TouchableOpacity 
              key={bank.id} 
              style={styles.bankItem}
              onPress={() => editor.handleEdit(bank)}
              activeOpacity={0.7}
            >
              <View style={styles.bankInfo}>
                {renderIcon(bank.icone, bank.cor, bank.nome)}
                <View style={styles.bankDetails}>
                  <Text style={styles.bankName}>{bank.nome}</Text>
                  <Text style={styles.bankBalance}>Saldo Atual: {bank.balance}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={(e) => {
                  e?.stopPropagation?.();
                  handleDeleteConfirm(bank);
                }}
              >
                <Ionicons name="trash-outline" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => editor.setSelectionModalVisible(true)}
        >
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <InstitutionSelectionModal
        visible={editor.selectionModalVisible}
        onClose={() => editor.setSelectionModalVisible(false)}
        onSelectInstitution={editor.handleSelectInstitution}
        onAddCustom={editor.handleAddCustomInstitution}
        availableInstitutions={editor.availableBanks}
      />

      <AddCustomInstitutionModal
        visible={editor.customModalVisible}
        onClose={() => editor.setCustomModalVisible(false)}
        onAdd={editor.handleAddCustom}
        tipoInicial="banco"
      />

      {/* Modal de Edição */}
      <ModalEditarInstituicao
        visible={editor.editModalVisible}
        onClose={() => editor.setEditModalVisible(false)}
        onSave={editor.handleUpdate}
        onDelete={async () => {
          if (!editor.selectedBank) {
            return;
          }

          await editor.handleDelete(editor.selectedBank.id);
          editor.setEditModalVisible(false);
        }}
        instituicao={editor.selectedBank ? {
          id: editor.selectedBank.id,
          nome: editor.selectedBank.nome,
          icone: editor.selectedBank.icone,
          cor: editor.selectedBank.cor,
          type: 'BANCO',
        } : null}
      />

      {/* Modal de Confirmar Deleção */}
      <ModalConfirmDelete
        visible={deleteModalVisible}
        titulo="Excluir Banco"
        mensagem={`Tem certeza que deseja excluir "${bankDeletando?.nome}"?\n\n⚠️ Atenção: Todas as transações vinculadas a este banco serão permanentemente deletadas.`}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteModalVisible(false);
          setBankDeletando(null);
        }}
        isLoading={isDeletando}
      />

      <ModalAviso
        visible={modalAviso.visible}
        titulo={modalAviso.titulo}
        mensagem={modalAviso.mensagem}
        onClose={fecharAviso}
      />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditBanksScreen;
