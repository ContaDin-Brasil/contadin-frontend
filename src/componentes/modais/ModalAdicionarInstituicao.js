import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddCustomInstitutionModal = ({ visible, onClose, onAdd, tipoInicial = 'banco' }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Banco');
  const [selectedColor, setSelectedColor] = useState('#E31C23');
  const [showColorWheel, setShowColorWheel] = useState(false);

  // Atualiza o tipo quando o modal abre com um tipo inicial diferente
  React.useEffect(() => {
    if (visible) {
      setType(tipoInicial === 'banco' ? 'Banco' : 'Vale');
    }
  }, [visible, tipoInicial]);

  // Cores predefinidas (mesmas do modal de edição)
  const predefinedColors = [
    '#E31C23', '#FF4444', '#FF6B6B', '#FF6600',
    '#FF9500', '#FFED00', '#FFD700', '#00AB63',
    '#21C25E', '#00E676', '#00D9E1', '#009EE3',
    '#007AFF', '#005CA9', '#820AD1', '#9C27B0',
    '#E91E63', '#CC092F', '#8B4513', '#666666',
    '#000000', '#4A9EFF',
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
      setShowColorWheel(false);
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
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          
          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Título do Modal */}
            <Text style={styles.modalTitle}>Adicionar Instituição</Text>

            {/* Nome da Instituição */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome da Instituição</Text>
              <TextInput 
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Meu Banco"
                placeholderTextColor="#999"
              />
            </View>

            {/* Tipo de Instituição */}
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
                  <Ionicons 
                    name="business" 
                    size={18} 
                    color={type === 'Banco' ? '#FFF' : '#666'}
                  />
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
                  <Ionicons 
                    name="card" 
                    size={18} 
                    color={type === 'Vale' ? '#FFF' : '#666'}
                  />
                  <Text style={[
                    styles.typeButtonText,
                    type === 'Vale' && styles.typeButtonTextActive
                  ]}>Vale</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Seletor de Cor Executivo */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Cor Destaque para a Instituição:</Text>
              
              {/* Botão executivo para escolher cor */}
              <TouchableOpacity 
                style={styles.seletorCorExecutivo}
                onPress={() => setShowColorWheel(!showColorWheel)}
                activeOpacity={0.7}
              >
                <View style={styles.corPreviewContainer}>
                  <View style={[styles.corPreviewCirculo, { backgroundColor: selectedColor }]} />
                  <View style={styles.corInfoContainer}>
                    <Text style={styles.corNomeLabel}>Cor Selecionada</Text>
                    <Text style={styles.corHexCode}>{selectedColor.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.alterarCorContainer}>
                  <Text style={styles.alterarCorTexto}>Escolher</Text>
                  <Ionicons 
                    name={showColorWheel ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color="#666" 
                  />
                </View>
              </TouchableOpacity>

              {/* Roda de Cores */}
              {showColorWheel && (
                <View style={styles.rodaDeCores}>
                  <View style={styles.gridCores}>
                    {predefinedColors.map((color, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          selectedColor === color && styles.colorOptionSelected
                        ]}
                        onPress={() => {
                          setSelectedColor(color);
                          setShowColorWheel(false);
                        }}
                      >
                        {selectedColor === color && (
                          <View style={styles.checkContainer}>
                            <Ionicons name="checkmark" size={20} color="#FFF" />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Botões de Ação */}
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
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
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
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  typeButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  typeButtonActive: {
    backgroundColor: '#4A9EFF',
    borderColor: '#4A9EFF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#FFF',
  },
  seletorCorExecutivo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  corPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  corPreviewCirculo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  corInfoContainer: {
    flex: 1,
  },
  corNomeLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
    marginBottom: 2,
  },
  corHexCode: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  alterarCorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alterarCorTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  rodaDeCores: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  gridCores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    transform: [{ scale: 1.1 }],
  },
  checkContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#4A9EFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4A9EFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonDisabled: {
    backgroundColor: '#B0D4FF',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddCustomInstitutionModal;
