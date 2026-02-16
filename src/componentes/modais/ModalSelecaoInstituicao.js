import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLogoByName } from './logosInstituicoes';

const InstitutionSelectionModal = ({ visible, onClose, onSelectInstitution, onAddCustom, tipo = 'banco', existingInstitutions = [] }) => {
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
    { id: 10, nome: 'PicPay', cor: '#21C25E', icone: 'P', tipoInstituicao: 'banco' },
    { id: 11, nome: 'Mercado Pago', cor: '#009EE3', icone: 'MP', tipoInstituicao: 'banco' },
  ];

  const valesPredefinidos = [
    { id: 14, nome: 'Alelo', cor: '#0066CC', icone: 'Al', tipoInstituicao: 'vale' },
    { id: 15, nome: 'Sodexo', cor: '#E2231A', icone: 'Sd', tipoInstituicao: 'vale' },
    { id: 16, nome: 'Ticket', cor: '#FF6600', icone: 'Tk', tipoInstituicao: 'vale' },
    { id: 17, nome: 'Flash', cor: '#00A859', icone: 'Fl', tipoInstituicao: 'vale' },
    ];

  // Filtra instituições predefinidas removendo as que já foram adicionadas
  const allPredefined = tipo === 'vale' ? valesPredefinidos : bancosPredefinidos;
  const existingNames = existingInstitutions.map(inst => inst.nome.toLowerCase().trim());
  const predefinedInstitutions = allPredefined.filter(
    inst => !existingNames.includes(inst.nome.toLowerCase().trim())
  );

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
            
            {predefinedInstitutions.length > 0 ? (
              <View style={styles.grid}>
                {predefinedInstitutions.map((institution) => {
                  const logo = getLogoByName(institution.nome);
                  return (
                    <TouchableOpacity
                      key={institution.id}
                      style={[styles.institutionCard, { backgroundColor: logo ? '#FFF' : institution.cor }]}
                      onPress={() => handleSelect(institution)}
                      activeOpacity={0.7}
                    >
                      {logo ? (
                        <Image 
                          source={logo} 
                          style={styles.institutionLogo}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={styles.institutionIcon}>{institution.icone}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle-outline" size={48} color="#999" />
                <Text style={styles.emptyText}>
                  {tipo === 'vale' 
                    ? 'Você já adicionou todos os vales disponíveis!' 
                    : 'Você já adicionou todos os bancos disponíveis!'}
                </Text>
              </View>
            )}

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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  institutionLogo: {
    width: '80%',
    height: '80%',
    padding: 4,
    objectFit: 'cover',
    borderRadius: 8,
  },
  institutionIcon: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
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
