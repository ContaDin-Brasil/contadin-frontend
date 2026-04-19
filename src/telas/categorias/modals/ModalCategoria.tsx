import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Category, CategoryType } from '../types/categoria.types';
import { CATEGORY_COLORS } from '../constants/constantesCategorias';
import ModalSelecaoIcone from './ModalSelecaoIcone';
import { styles } from '../style/ModalCategoria.style';

interface ModalCategoriaProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { nome: string; tipo: CategoryType; cor: string; icone: string }) => Promise<boolean>;
  categoria?: Category | null;
  tipoInicial?: CategoryType;
  nomeInicial?: string;
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({
  visible,
  onClose,
  onSave,
  categoria,
  tipoInicial,
  nomeInicial,
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
    } else if (nomeInicial) {
      // Pré-preencher com nome inicial para criação
      setNome(nomeInicial);
      setTipo(tipoInicial || 'GASTO');
      setCor(CATEGORY_COLORS[0]);
      setIcone('shopping-cart');
    } else {
      resetForm();
    }
  }, [categoria, visible, nomeInicial, tipoInicial]);

  const resetForm = () => {
    setNome('');
    setTipo(tipoInicial);
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
      // Usar setTimeout para garantir que o estado foi atualizado antes de fechar
      setTimeout(() => {
        onClose();
      }, 100);
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
                  <Text style={styles.typeText}>Despesa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    tipo === 'GLOBAL' && styles.typeButtonActive,
                  ]}
                  onPress={() => setTipo('GLOBAL')}
                >
                  <View style={[
                    styles.typeRadio,
                    tipo === 'GLOBAL' && styles.typeRadioActive,
                  ]} />
                  <Text style={styles.typeText}>Ambos</Text>
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

export default ModalCategoria;
