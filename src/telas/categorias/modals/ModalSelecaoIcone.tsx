import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CATEGORY_ICONS } from '../constants/constantesCategorias';

interface ModalSelecaoIconeProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (icon: string) => void;
  selectedIcon?: string;
}

const ModalSelecaoIcone: React.FC<ModalSelecaoIconeProps> = ({
  visible,
  onClose,
  onSelect,
  selectedIcon,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.handle} />
          
          <Text style={styles.title}>Selecione um ícone</Text>
          
          <FlatList
            data={CATEGORY_ICONS}
            keyExtractor={(item) => item}
            numColumns={5}
            contentContainerStyle={styles.iconGrid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  selectedIcon === item && styles.iconButtonSelected,
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <MaterialIcons
                  name={item as any}
                  size={28}
                  color={selectedIcon === item ? '#FFF' : '#333'}
                />
              </TouchableOpacity>
            )}
          />
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#CCC',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  iconGrid: {
    paddingBottom: 20,
  },
  iconButton: {
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonSelected: {
    backgroundColor: '#4A9EFF',
  },
  closeButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});

export default ModalSelecaoIcone;
