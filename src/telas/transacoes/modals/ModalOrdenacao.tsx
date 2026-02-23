import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../../styles/colors';

interface ModalOrdenacaoProps {
  visible: boolean;
  onClose: () => void;
  ordenacaoAtual: string;
  onSelectOrdenacao: (ordenacao: string) => void;
}

const opcoesOrdenacao = [
  { label: 'Mais recentes', value: 'Mais recentes', icon: 'arrow-down' },
  { label: 'Mais antigas', value: 'Mais antigas', icon: 'arrow-up' },
  { label: 'Maior valor', value: 'Maior valor', icon: 'trending-up' },
  { label: 'Menor valor', value: 'Menor valor', icon: 'trending-down' },
  { label: 'A-Z (descrição)', value: 'A-Z', icon: 'text-outline' },
  { label: 'Z-A (descrição)', value: 'Z-A', icon: 'text-outline' },
];

export const ModalOrdenacao: React.FC<ModalOrdenacaoProps> = ({
  visible,
  onClose,
  ordenacaoAtual,
  onSelectOrdenacao,
}) => {
  const handleSelect = (value: string) => {
    onSelectOrdenacao(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.header}>
              <Text style={styles.title}>Ordenar por</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsList}>
              {opcoesOrdenacao.map((opcao) => {
                const isSelected = ordenacaoAtual === opcao.value;
                return (
                  <TouchableOpacity
                    key={opcao.value}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                    onPress={() => handleSelect(opcao.value)}
                  >
                    <View style={styles.optionContent}>
                      <Ionicons
                        name={opcao.icon as any}
                        size={20}
                        color={isSelected ? COLORS.primary : COLORS.textSecondary}
                      />
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {opcao.label}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  optionItemSelected: {
    backgroundColor: COLORS.primaryLighter,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
