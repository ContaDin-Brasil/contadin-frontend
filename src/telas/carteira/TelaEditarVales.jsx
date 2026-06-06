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
import { useEditarVales } from './hooks/useEditarInstituicoes';
import { getLogoByName } from '../../componentes/modais/logosInstituicoes';
import { getStyles } from './styles/TelaEditarVales.styles';
import { getColorsByTheme } from '../../styles/colors';
import { useTheme } from '../../contexts/ThemeContext';

const EditVouchersScreen = ({ navigation }) => {
  const editor = useEditarVales();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const COLORS = getColorsByTheme(isDarkMode);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [voucherDeletando, setVoucherDeletando] = React.useState(null);
  const [isDeletando, setIsDeletando] = React.useState(false);
  const [modalAviso, setModalAviso] = React.useState({ visible: false, titulo: '', mensagem: '' });

  const fecharAviso = () => setModalAviso((prev) => ({ ...prev, visible: false }));
  const mostrarAviso = (titulo, mensagem) => setModalAviso({ visible: true, titulo, mensagem });

  // Recarrega vales quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      editor.carregarVales(true); // forceRefresh=true para sempre buscar dados frescos
    }, [])
  );

  const handleDeleteConfirm = (voucher) => {
    setVoucherDeletando(voucher);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!voucherDeletando) return;

    setIsDeletando(true);
    try {
      await editor.handleDelete(voucherDeletando.id);
      setDeleteModalVisible(false);
      setVoucherDeletando(null);
    } catch (error) {
      console.error('Erro ao deletar vale:', error);
      mostrarAviso('Erro', 'Não foi possível deletar o vale');
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
            Editar Vales
          </TituloPagina>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.textSecondary }}>Carregando vales...</Text>
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
        Editar Vales
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.textPrimary} />
          <View style={styles.sectionTitleText}>
            <Text style={styles.sectionTitle}>Vales</Text>
          </View>
        </View>

        <View style={styles.vouchersList}>
          {editor.vouchers.map((voucher) => (
            <TouchableOpacity 
              key={voucher.id} 
              style={styles.voucherItem}
              onPress={() => editor.handleEdit(voucher)}
              activeOpacity={0.7}
            >
              <View style={styles.voucherInfo}>
                {renderIcon(voucher.icone, voucher.cor, voucher.nome)}
                <View style={styles.voucherDetails}>
                  <Text style={styles.voucherName}>{voucher.nome}</Text>
                  <Text style={styles.voucherBalance}>Saldo Atual: {voucher.balance}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.deleteIconButton}
                onPress={(e) => {
                  e?.stopPropagation?.();
                  handleDeleteConfirm(voucher);
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
        availableInstitutions={editor.availableVouchers}
      />

      <AddCustomInstitutionModal
        visible={editor.customModalVisible}
        onClose={() => editor.setCustomModalVisible(false)}
        onAdd={editor.handleAddCustom}
        tipoInicial="vale"
      />

      {/* Modal de Edição */}
      <ModalEditarInstituicao
        visible={editor.editModalVisible}
        onClose={() => editor.setEditModalVisible(false)}
        onSave={editor.handleUpdate}
        onDelete={async () => {
          if (!editor.selectedVoucher) {
            return;
          }

          await editor.handleDelete(editor.selectedVoucher.id);
          editor.setEditModalVisible(false);
        }}
        instituicao={editor.selectedVoucher ? {
          id: editor.selectedVoucher.id,
          nome: editor.selectedVoucher.nome,
          icone: editor.selectedVoucher.icone,
          cor: editor.selectedVoucher.cor,
          type: 'VALE',
        } : null}
      />

      {/* Modal de Confirmar Deleção */}
      <ModalConfirmDelete
        visible={deleteModalVisible}
        titulo="Excluir Vale"
        mensagem={`Tem certeza que deseja excluir "${voucherDeletando?.nome}"?\n\n⚠️ Atenção: Todas as transações vinculadas a este vale serão permanentemente deletadas.`}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteModalVisible(false);
          setVoucherDeletando(null);
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

export default EditVouchersScreen;
