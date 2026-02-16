import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from '../../componentes/modais/ModalBase';
import InstitutionSelectionModal from '../../componentes/modais/ModalSelecaoInstituicao';
import AddCustomInstitutionModal from '../../componentes/modais/ModalAdicionarInstituicao';
import { useEditarVales } from './hooks/useEditarInstituicoes';
import { styles } from './styles/TelaEditarVales.styles';

const EditVouchersScreen = ({ navigation }) => {
  const editor = useEditarVales();

  const renderIcon = (text, color) => (
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <Text style={styles.iconText}>{text}</Text>
    </View>
  );

  // Mostra loading
  if (editor.loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Editar Vales</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8A05BE" />
          <Text style={{ marginTop: 16, color: '#666' }}>Carregando vales...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Vales</Text>
      </View>

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
                {renderIcon(voucher.icone, voucher.cor)}
                <View style={styles.voucherDetails}>
                  <Text style={styles.voucherName}>{voucher.nome}</Text>
                  <Text style={styles.voucherBalance}>Saldo Atual: {voucher.balance}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.deleteIconButton}
                onPress={(e) => {
                  e.stopPropagation();
                  editor.handleDelete(voucher);
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
        tipo="vale"
      />

      <AddCustomInstitutionModal
        visible={editor.customModalVisible}
        onClose={() => editor.setCustomModalVisible(false)}
        onAdd={editor.handleAddCustom}
      />

      {/* Edit Modal */}
      <CustomModal
        visible={editor.editModalVisible}
        onClose={() => editor.setEditModalVisible(false)}
        title=""
        showButtons={false}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.deleteInstitutionButton}
            onPress={() => {
              editor.handleDelete(editor.selectedVoucher);
              editor.setEditModalVisible(false);
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#FFF" />
            <Text style={styles.deleteInstitutionText}>Excluir instituição</Text>
          </TouchableOpacity>

          <View style={styles.institutionHeader}>
            <View style={[styles.institutionIconLarge, { backgroundColor: editor.selectedVoucher?.cor }]}>
              <Text style={styles.institutionIconText}>{editor.selectedVoucher?.icone}</Text>
            </View>
            <Text style={styles.institutionName}>{editor.selectedVoucher?.nome}</Text>
            <Ionicons name="create-outline" size={20} color="#000" />
          </View>

          <Text style={styles.changeIconText}>Alterar ícone</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Instituição:</Text>
            <TextInput style={styles.input} placeholder="" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Cor Destaque para a Instituição:</Text>
            <View style={[styles.colorPicker, { backgroundColor: editor.selectedVoucher?.cor }]}>
              <Ionicons name="create-outline" size={24} color="#FFF" />
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => editor.setEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => editor.setEditModalVisible(false)}
            >
              <Text style={styles.confirmButtonText}>Confirmar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>
    </ScrollView>
  );
};

export default EditVouchersScreen;
