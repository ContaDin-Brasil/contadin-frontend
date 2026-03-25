import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import TituloPagina from '../../componentes/TituloPagina';
import InstitutionSelectionModal from '../../componentes/modais/ModalSelecaoInstituicao';
import AddCustomInstitutionModal from '../../componentes/modais/ModalAdicionarInstituicao';
import ModalEditarInstituicao from '../../componentes/modais/ModalEditarInstituicao';
import { useEditarVales } from './hooks/useEditarInstituicoes';
import { getLogoByName } from '../../componentes/modais/logosInstituicoes';
import { confirmarAcao } from '../../utils/confirmarAcao';
import { styles } from './styles/TelaEditarVales.styles';

const EditVouchersScreen = ({ navigation }) => {
  const editor = useEditarVales();

  // Recarrega vales quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      editor.carregarVales();
    }, [])
  );

  const handleDeleteConfirm = (voucher) => {
    const mensagem = `Tem certeza que deseja excluir "${voucher.nome}"?\n\n⚠️ Atenção: Todas as transações vinculadas a esta instituição serão permanentemente deletadas.`;

    confirmarAcao({
      titulo: 'Excluir Instituição',
      mensagem,
      textoConfirmar: 'Excluir',
      onConfirmar: () => editor.handleDelete(voucher.id),
    });
  };

  const renderIcon = (text, color, institutionName) => {
    const logo = getLogoByName(institutionName);
    
    return (
      <View style={[styles.iconContainer, { backgroundColor: logo ? '#FFF' : color }]}>
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
          <ActivityIndicator size="large" color="#8A05BE" />
          <Text style={{ marginTop: 16, color: '#666' }}>Carregando vales...</Text>
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
          <Ionicons name="information-circle-outline" size={24} color="#000" />
          <View style={styles.sectionTitleText}>
            <Text style={styles.sectionTitle}>Vales</Text>
            <Text style={styles.sectionSubtitle}>Valor das faturas: R$ 0,00</Text>
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
                <Ionicons name="trash-outline" size={22} color="#666" />
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
          <Ionicons name="add" size={20} color="#FFF" />
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
          tipoInstituicao: 'vale',
        } : null}
      />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditVouchersScreen;
