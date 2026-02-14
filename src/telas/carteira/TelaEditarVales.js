import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from '../../componentes/modais/ModalBase';
import InstitutionSelectionModal from '../../componentes/modais/ModalSelecaoInstituicao';
import AddCustomInstitutionModal from '../../componentes/modais/ModalAdicionarInstituicao';

const EditVouchersScreen = ({ navigation }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);

  const [vouchers, setVouchers] = useState([
    { id: 1, name: 'Alelo', balance: 'R$ 0,00', color: '#7FBA00', icon: 'A' },
    { id: 2, name: 'Flash', balance: 'R$ 0,00', color: '#FF1493', icon: 'F' },
  ]);

  const handleEdit = (voucher) => {
    setSelectedVoucher(voucher);
    setEditModalVisible(true);
  };

  const handleDelete = (voucher) => {
    setVouchers(vouchers.filter(v => v.id !== voucher.id));
  };

  const handleSelectInstitution = (institution) => {
    const newVoucher = {
      ...institution,
      id: Date.now(),
      balance: 'R$ 0,00',
    };
    setVouchers([...vouchers, newVoucher]);
  };

  const handleAddCustomInstitution = () => {
    setSelectionModalVisible(false);
    setCustomModalVisible(true);
  };

  const handleAddCustom = (institution) => {
    setVouchers([...vouchers, institution]);
  };

  const renderIcon = (text, color) => (
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <Text style={styles.iconText}>{text}</Text>
    </View>
  );

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
          {vouchers.map((voucher) => (
            <TouchableOpacity 
              key={voucher.id} 
              style={styles.voucherItem}
              onPress={() => handleEdit(voucher)}
              activeOpacity={0.7}
            >
              <View style={styles.voucherInfo}>
                {renderIcon(voucher.icon, voucher.color)}
                <View style={styles.voucherDetails}>
                  <Text style={styles.voucherName}>{voucher.name}</Text>
                  <Text style={styles.voucherBalance}>Saldo Atual: {voucher.balance}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.deleteIconButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDelete(voucher);
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
          onPress={() => setSelectionModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <InstitutionSelectionModal
        visible={selectionModalVisible}
        onClose={() => setSelectionModalVisible(false)}
        onSelectInstitution={handleSelectInstitution}
        onAddCustom={handleAddCustomInstitution}
      />

      <AddCustomInstitutionModal
        visible={customModalVisible}
        onClose={() => setCustomModalVisible(false)}
        onAdd={handleAddCustom}
      />

      {/* Edit Modal */}
      <CustomModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        title=""
        showButtons={false}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.deleteInstitutionButton}>
            <Ionicons name="trash-outline" size={20} color="#FFF" />
            <Text style={styles.deleteInstitutionText}>Excluir instituição</Text>
          </TouchableOpacity>

          <View style={styles.institutionHeader}>
            <View style={[styles.institutionIconLarge, { backgroundColor: selectedVoucher?.color }]}>
              <Text style={styles.institutionIconText}>{selectedVoucher?.icon}</Text>
            </View>
            <Text style={styles.institutionName}>{selectedVoucher?.name}</Text>
            <Ionicons name="create-outline" size={20} color="#000" />
          </View>

          <Text style={styles.changeIconText}>Alterar ícone</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Instituição:</Text>
            <TextInput style={styles.input} placeholder="" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Cor Destaque para a Instituição:</Text>
            <View style={[styles.colorPicker, { backgroundColor: selectedVoucher?.color }]}>
              <Ionicons name="create-outline" size={24} color="#FFF" />
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.confirmButtonText}>Confirmar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitleText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  vouchersList: {
    gap: 10,
  },
  voucherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  voucherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  voucherDetails: {
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  voucherName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  voucherBalance: {
    fontSize: 13,
    color: '#666',
  },
  deleteIconButton: {
    padding: 4,
  },
  addButtonContainer: {
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#4A9EFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    paddingVertical: 10,
  },
  deleteInstitutionButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 20,
  },
  deleteInstitutionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  institutionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  institutionIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  institutionIconText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  institutionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  changeIconText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#E0E0E0',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
  },
  colorPicker: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4A9EFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditVouchersScreen;
