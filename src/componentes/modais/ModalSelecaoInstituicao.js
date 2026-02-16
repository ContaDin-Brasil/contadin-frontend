import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InstitutionSelectionModal = ({ visible, onClose, onSelectInstitution, onAddCustom, tipo = 'banco' }) => {
  const bancosPredefinidos = [
    { id: 1, nome: 'Santander', cor: '#E31C23', icone: 'S', tipoInstituicao: 'banco' },
    { id: 2, nome: 'Nubank', cor: '#820AD1', icone: 'Nu', tipoInstituicao: 'banco' },
    { id: 3, nome: 'Itaú', cor: '#FF6600', icone: 'I', tipoInstituicao: 'banco' },
    { id: 4, nome: 'Inter', cor: '#FF7A00', icone: 'I', tipoInstituicao: 'banco' },
    { id: 5, nome: 'Bradesco', cor: '#CC092F', icone: 'B', tipoInstituicao: 'banco' },
    { id: 6, nome: 'Banco do Brasil', cor: '#FFED00', icone: 'BB', tipoInstituicao: 'banco' },
    { id: 7, nome: 'Caixa', cor: '#005CA9', icone: 'C', tipoInstituicao: 'banco' },
    { id: 8, nome: 'C6 Bank', cor: '#000000', icone: 'C6', tipoInstituicao: 'banco' },
    { id: 9, nome: 'Next', cor: '#00AB63', icone: 'N', tipoInstituicao: 'banco' },
    { id: 10, nome: 'Neon', cor: '#00D9E1', icone: 'Ne', tipoInstituicao: 'banco' },
    { id: 11, nome: 'PicPay', cor: '#21C25E', icone: 'P', tipoInstituicao: 'banco' },
    { id: 12, nome: 'Mercado Pago', cor: '#009EE3', icone: 'MP', tipoInstituicao: 'banco' },
  ];

  const valesPredefinidos = [
    { id: 13, nome: 'Vale Refeição', cor: '#4CAF50', icone: 'VR', tipoInstituicao: 'vale' },
    { id: 14, nome: 'Vale Alimentação', cor: '#FF9800', icone: 'VA', tipoInstituicao: 'vale' },
    { id: 15, nome: 'Alelo', cor: '#0066CC', icone: 'Al', tipoInstituicao: 'vale' },
    { id: 16, nome: 'Sodexo', cor: '#E2231A', icone: 'Sd', tipoInstituicao: 'vale' },
    { id: 17, nome: 'Ticket', cor: '#FF6600', icone: 'Tk', tipoInstituicao: 'vale' },
    { id: 18, nome: 'Flash', cor: '#00A859', icone: 'Fl', tipoInstituicao: 'vale' },
    { id: 19, nome: 'VR Benefícios', cor: '#009624', icone: 'VR', tipoInstituicao: 'vale' },
    { id: 20, nome: 'Ben Visa Vale', cor: '#1A1F71', icone: 'BV', tipoInstituicao: 'vale' },
  ];

  const predefinedInstitutions = tipo === 'vale' ? valesPredefinidos : bancosPredefinidos;

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
            <Text style={styles.title}>
              {tipo === 'vale' ? 'Selecione um Vale:' : 'Selecione uma Instituição:'}
            </Text>
            
            <View style={styles.grid}>
              {predefinedInstitutions.map((institution) => (
                <TouchableOpacity
                  key={institution.id}
                  style={[styles.institutionCard, { backgroundColor: institution.cor }]}
                  onPress={() => handleSelect(institution)}
                >
                  <Text style={styles.institutionIcon}>{institution.icone}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customSection}>
              <Text style={styles.customText}>
                {tipo === 'vale' ? 'Seu vale não está na lista? ' : 'Seu banco não está na lista? '}
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
