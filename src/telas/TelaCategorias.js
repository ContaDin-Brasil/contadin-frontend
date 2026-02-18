import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TituloPagina from '../componentes/TituloPagina';
import { styles } from './styles/TelaCategorias.styles';
import { useGerenciarCategorias } from './categorias/hooks/useGerenciarCategorias';
import ModalCategoria from './categorias/modals/ModalCategoria';

const TelaCategorias = () => {
  const {
    categorias,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria,
  } = useGerenciarCategorias();

  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState(null);

  const handleAddCategoria = () => {
    setCategoriaParaEditar(null);
    setModalVisible(true);
  };

  const handleEditCategoria = (categoria) => {
    if (categoria.isSystem) {
      Alert.alert('Aviso', 'Categorias do sistema não podem ser editadas');
      return;
    }
    setCategoriaParaEditar(categoria);
    setModalVisible(true);
  };

  const handleDeleteCategoria = (categoria) => {
    if (categoria.isSystem) {
      Alert.alert('Aviso', 'Categorias do sistema não podem ser deletadas');
      return;
    }

    Alert.alert(
      'Excluir Categoria',
      `Tem certeza que deseja excluir "${categoria.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deletarCategoria(categoria.id),
        },
      ]
    );
  };

  const handleSaveCategoria = async (data) => {
    try {
      if (categoriaParaEditar) {
        const success = await atualizarCategoria(categoriaParaEditar.id, data);
        return success;
      } else {
        const success = await criarCategoria(data);
        return success;
      }
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      return false;
    }
  };

  const renderCategoriaItem = ({ item }) => (
    <View style={styles.categoriaItem}>
      <View style={styles.categoriaInfo}>
        <View style={[styles.categoriaIcone, { backgroundColor: item.cor }]}>
          <MaterialIcons name={item.icone} size={24} color="#FFF" />
        </View>
        <Text style={styles.categoriaNome}>{item.nome}</Text>
      </View>
      {!item.isSystem && (
        <View style={styles.categoriaActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditCategoria(item)}
          >
            <MaterialIcons name="edit" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteCategoria(item)}
          >
            <MaterialIcons name="delete" size={20} color="#E53935" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina>Categorias</TituloPagina>

      {/* Toggle de Tipo */}
      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedType === 'RECEITA' && styles.toggleButtonActive,
          ]}
          onPress={() => setSelectedType('RECEITA')}
        >
          <Text
            style={[
              styles.toggleButtonText,
              selectedType === 'RECEITA' && styles.toggleButtonTextActive,
            ]}
          >
            Receitas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedType === 'GASTO' && styles.toggleButtonActive,
          ]}
          onPress={() => setSelectedType('GASTO')}
        >
          <Text
            style={[
              styles.toggleButtonText,
              selectedType === 'GASTO' && styles.toggleButtonTextActive,
            ]}
          >
            Despesas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar categoria..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Categorias */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={categorias}
          renderItem={renderCategoriaItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="category" size={48} color="#CCC" />
              <Text style={styles.emptyText}>Nenhuma categoria encontrada</Text>
            </View>
          }
        />
      )}

      {/* Botão Flutuante */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleAddCategoria}>
        <MaterialIcons name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Modal de Adicionar/Editar */}
      <ModalCategoria
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setCategoriaParaEditar(null);
        }}
        onSave={handleSaveCategoria}
        categoria={categoriaParaEditar}
      />
    </SafeAreaView>
  );
};

export default TelaCategorias;
