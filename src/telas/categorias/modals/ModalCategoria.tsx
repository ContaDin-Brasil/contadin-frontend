import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Category, CategoryType } from '../types/categoria.types';
import { CATEGORY_COLORS } from '../constants/constantesCategorias';
import ModalSelecaoIcone from './ModalSelecaoIcone';

interface ModalCategoriaProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { nome: string; tipo: CategoryType; cor: string; icone: string }) => Promise<boolean>;
  categoria?: Category | null;
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({
  visible,
  onClose,
  onSave,
  categoria,
}) => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<CategoryType>('GASTO');
  const [cor, setCor] = useState(CATEGORY_COLORS[0]);
  const [icone, setIcone] = useState('shopping-cart');
  const [iconModalVisible, setIconModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (categoria) {
      setNome(categoria.nome);
      setTipo(categoria.tipo || 'GASTO');
      setCor(categoria.cor || CATEGORY_COLORS[0]);
      setIcone(categoria.icone || 'shopping-cart');
    } else {
      resetForm();
    }
  }, [categoria, visible]);

  const resetForm = () => {
    setNome('');
    setTipo('GASTO');
    setCor(CATEGORY_COLORS[0]);
    setIcone('shopping-cart');
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Digite um nome para a categoria');
      return;
    }

    setSaving(true);
    const success = await onSave({ nome, tipo, cor, icone });
    setSaving(false);

    if (success) {
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleClose}
      >
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {categoria ? 'Editar Categoria' : 'Criar Categoria'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            {/* Tipo de Categoria */}
            <View style={styles.section}>
              <Text style={styles.label}>Categoria de:</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    tipo === 'RECEITA' && styles.typeButtonActive,
                  ]}
                  onPress={() => setTipo('RECEITA')}
                >
                  <View style={[
                    styles.typeRadio,
                    tipo === 'RECEITA' && styles.typeRadioActive,
                  ]} />
                  <Text style={styles.typeText}>Receita</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    tipo === 'GASTO' && styles.typeButtonActive,
                  ]}
                  onPress={() => setTipo('GASTO')}
                >
                  <View style={[
                    styles.typeRadio,
                    tipo === 'GASTO' && styles.typeRadioActive,
                  ]} />
                  <Text style={styles.typeText}>Despesas</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Nome da Categoria */}
            <View style={styles.section}>
              <Text style={styles.label}>Nome da categoria</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome"
                placeholderTextColor="#999"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            {/* Cor */}
            <View style={styles.section}>
              <Text style={styles.label}>Cor Destaque para a Categoria:</Text>
              <View style={styles.colorGrid}>
                {CATEGORY_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      cor === color && styles.colorButtonSelected,
                    ]}
                    onPress={() => setCor(color)}
                  >
                    {cor === color && (
                      <MaterialIcons name="check" size={20} color="#FFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Ícone */}
            <View style={styles.section}>
              <Text style={styles.label}>Escolha um ícone:</Text>
              <TouchableOpacity
                style={styles.iconSelector}
                onPress={() => setIconModalVisible(true)}
              >
                <View style={styles.iconCircle}>
                  <MaterialIcons name={icone as any} size={24} color="#666" />
                </View>
                <Text style={styles.iconSelectorText}>Selecione um ícone</Text>
              </TouchableOpacity>
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {categoria ? 'Salvar Alterações' : 'Criar Categoria'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <ModalSelecaoIcone
        visible={iconModalVisible}
        onClose={() => setIconModalVisible(false)}
        onSelect={setIcone}
        selectedIcon={icone}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    backgroundColor: '#FFF',
  },
  typeRadioActive: {
    borderColor: '#4A9EFF',
    backgroundColor: '#4A9EFF',
  },
  typeText: {
    fontSize: 16,
    color: '#333',
  },
  typeButtonActive: {},
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F5F5F5',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorButtonSelected: {
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelectorText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4A9EFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default ModalCategoria;
