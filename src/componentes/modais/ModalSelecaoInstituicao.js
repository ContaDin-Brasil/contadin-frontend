import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InstitutionSelectionModal = ({ visible, onClose, onSelectInstitution, onAddCustom }) => {
  const predefinedInstitutions = [
    { id: 1, name: 'Santander', color: '#E31C23', icon: 'S' },
    { id: 2, name: 'Nubank', color: '#820AD1', icon: 'Nu' },
    { id: 3, name: 'Itaú', color: '#FF6600', icon: 'I' },
    { id: 4, name: 'Inter', color: '#FF7A00', icon: 'I' },
    { id: 5, name: 'Bradesco', color: '#CC092F', icon: 'B' },
    { id: 6, name: 'Banco do Brasil', color: '#FFED00', icon: 'BB' },
    { id: 7, name: 'Caixa', color: '#005CA9', icon: 'C' },
    { id: 8, name: 'C6 Bank', color: '#000000', icon: 'C6' },
    { id: 9, name: 'Next', color: '#00AB63', icon: 'N' },
    { id: 10, name: 'Neon', color: '#00D9E1', icon: 'Ne' },
    { id: 11, name: 'PicPay', color: '#21C25E', icon: 'P' },
    { id: 12, name: 'Mercado Pago', color: '#009EE3', icon: 'MP' },
  ];

  const handleSelect = (institution) => {
    onSelectInstitution(institution);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.handle} />
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Selecione uma Instituição:</Text>
            
            <View style={styles.grid}>
              {predefinedInstitutions.map((institution) => (
                <TouchableOpacity
                  key={institution.id}
                  style={[styles.institutionCard, { backgroundColor: institution.color }]}
                  onPress={() => handleSelect(institution)}
                >
                  <Text style={styles.institutionIcon}>{institution.icon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customSection}>
              <Text style={styles.customText}>
                Seu banco não está na lista?{' '}
                <Text style={styles.customLink} onPress={onAddCustom}>Adicionar</Text>
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={onAddCustom}
              >
                <Text style={styles.addButtonText}>Adicionar Instituição</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#CCC',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  institutionCard: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  institutionIcon: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  customSection: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  customText: {
    fontSize: 14,
    color: '#666',
  },
  customLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InstitutionSelectionModal;
