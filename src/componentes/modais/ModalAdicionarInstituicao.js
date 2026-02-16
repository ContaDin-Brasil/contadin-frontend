import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddCustomInstitutionModal = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Banco');
  const [selectedColor, setSelectedColor] = useState('#E31C23');
  const [customIcon, setCustomIcon] = useState(false);

  const predefinedColors = [
    '#E31C23', '#820AD1', '#FF6600', '#FF7A00', 
    '#CC092F', '#FFED00', '#005CA9', '#000000',
    '#00AB63', '#00D9E1', '#21C25E', '#009EE3',
  ];

  const handleAdd = () => {
    if (name.trim()) {
      const newInstitution = {
        id: Date.now(),
        nome: name.trim(),
        tipoInstituicao: type === 'Banco' ? 'banco' : 'vale',
        cor: selectedColor,
        icone: name.charAt(0).toUpperCase(),
        balance: 'R$ 0,00',
        expenses: 'R$ 0,00',
      };
      onAdd(newInstitution);
      // Reset form
      setName('');
      setType('Banco');
      setSelectedColor('#E31C23');
      setCustomIcon(false);
      onClose();
    }
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
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome para a Instituição</Text>
              <TextInput 
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite o nome"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tipo de Instituição:</Text>
              <View style={styles.typeButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === 'Banco' && styles.typeButtonActive
                  ]}
                  onPress={() => setType('Banco')}
                >
                  <Text style={[
                    styles.typeButtonText,
                    type === 'Banco' && styles.typeButtonTextActive
                  ]}>Banco</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === 'Vale' && styles.typeButtonActive
                  ]}
                  onPress={() => setType('Vale')}
                >
                  <Text style={[
                    styles.typeButtonText,
                    type === 'Vale' && styles.typeButtonTextActive
                  ]}>Vale</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Cor Destaque para a Instituição:</Text>
              <View style={[styles.colorPickerLarge, { backgroundColor: selectedColor }]}>
                <Ionicons name="create-outline" size={28} color="#FFF" />
              </View>
              
              <View style={styles.colorGrid}>
                {predefinedColors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Ionicons name="checkmark" size={16} color="#FFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.customIconContainer}
              onPress={() => setCustomIcon(!customIcon)}
            >
              <View style={styles.checkbox}>
                {customIcon && <Ionicons name="checkmark" size={16} color="#007AFF" />}
              </View>
              <Text style={styles.customIconText}>Adicionar ícone personalizado</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.addButton, !name.trim() && styles.addButtonDisabled]}
                onPress={handleAdd}
                disabled={!name.trim()}
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
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },
  typeButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#FFF',
  },
  colorPickerLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  customIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customIconText: {
    fontSize: 14,
    color: '#000',
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
  addButtonDisabled: {
    backgroundColor: '#B0D4FF',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddCustomInstitutionModal;
