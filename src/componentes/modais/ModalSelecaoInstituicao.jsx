import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLogoByName } from './logosInstituicoes';
import { COLORS } from '../../styles/colors';
import { normalizarTipoInstituicaoDaEntidade } from '../../utils/normalizacao';

const InstitutionSelectionModal = ({ visible, onClose, onSelectInstitution, onAddCustom, availableInstitutions = [] }) => {
  // Separa instituições por tipo
  const bancos = availableInstitutions.filter((inst) => normalizarTipoInstituicaoDaEntidade(inst) === 'BANCO');
  const vales = availableInstitutions.filter((inst) => normalizarTipoInstituicaoDaEntidade(inst) === 'VALE');

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
        <View style={[styles.cardIconContainer, { backgroundColor: logo ? COLORS.white : institution.cor }]}>
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
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecione uma Instituição</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Seção Bancos */}
            {bancos.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="business" size={20} color={COLORS.textSecondary} />
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
                  <Ionicons name="card" size={20} color={COLORS.textSecondary} />
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
              <Ionicons name="add-circle-outline" size={24} color={COLORS.primaryLight} />
              <Text style={styles.addCustomText}>Adicionar instituição personalizada</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
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
    backgroundColor: COLORS.white,
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
    borderBottomColor: COLORS.backgroundDark,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
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
    color: COLORS.textSecondary,
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
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
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
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    objectFit: 'cover',
  },
  institutionName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryLighter,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  addCustomText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primaryLight,
  },
});

export default InstitutionSelectionModal;
