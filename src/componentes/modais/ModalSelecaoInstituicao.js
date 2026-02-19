import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLogoByName } from './logosInstituicoes';

const InstitutionSelectionModal = ({ visible, onClose, onSelectInstitution, onAddCustom, availableInstitutions = [] }) => {
  // Separa instituições por tipo
  const bancos = availableInstitutions.filter(inst => inst.tipoInstituicao === 'banco');
  const vales = availableInstitutions.filter(inst => inst.tipoInstituicao === 'vale');

  const handleSelect = (institution) => {
    onSelectInstitution(institution);
    onClose();
  };

  const renderInstitutionCard = (institution) => {
    const logo = getLogoByName(institution.nome);
    return (
      <TouchableOpacity
        key={institution.id}
        style={[styles.institutionCard, { borderColor: institution.cor }]}
        onPress={() => handleSelect(institution)}
        activeOpacity={0.7}
      >
        <View style={[styles.cardIconContainer, { backgroundColor: logo ? '#FFF' : institution.cor }]}>
          {logo ? (
            <Image 
              source={logo} 
              style={styles.institutionLogo}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.institutionIcon}>{institution.icone}</Text>
          )}
        </View>
        <Text style={styles.institutionName} numberOfLines={1}>{institution.nome}</Text>
      </TouchableOpacity>
    );
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
          <View style={styles.header}>
            <Text style={styles.title}>Selecione uma Instituição</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Seção Bancos */}
            {bancos.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="business" size={20} color="#666" />
                  <Text style={styles.sectionTitle}>Bancos</Text>
                </View>
                <View style={styles.grid}>
                  {bancos.map(renderInstitutionCard)}
                </View>
              </View>
            )}

            {/* Seção Vales */}
            {vales.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="card" size={20} color="#666" />
                  <Text style={styles.sectionTitle}>Vales</Text>
                </View>
                <View style={styles.grid}>
                  {vales.map(renderInstitutionCard)}
                </View>
              </View>
            )}

            {/* Botão adicionar customizada */}
            <TouchableOpacity 
              style={styles.addCustomButton}
              onPress={onAddCustom}
            >
              <Ionicons name="add-circle-outline" size={24} color="#5BA3FF" />
              <Text style={styles.addCustomText}>Adicionar instituição personalizada</Text>
            </TouchableOpacity>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  institutionCard: {
    width: '22%',
    aspectRatio: 0.9,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    padding: 8,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    overflow: 'hidden',
  },
  institutionLogo: {
    width: 42,
    height: 42,
    objectFit: 'cover',
    borderRadius: 8,
  },
  institutionIcon: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    objectFit: 'cover',
  },
  institutionName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F9FF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5BA3FF',
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  addCustomText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5BA3FF',
  },
});

export default InstitutionSelectionModal;
