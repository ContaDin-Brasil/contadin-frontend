import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./style/TelaCategorias.styles";
import { useGerenciarCategorias } from "../categorias/hooks/useGerenciarCategorias";
import { isPadrao } from "../categorias/types/categoria.types";
import ModalCategoria from "../categorias/modals/ModalCategoria";
import TituloPagina from "../../componentes/TituloPagina";
import BotaoFlutuanteAdicionar from "../../componentes/BotaoFlutuanteAdicionar";

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
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handleAddCategoria = () => {
    setCategoriaParaEditar(null);
    setModalVisible(true);
  };

  const handleEditCategoria = (categoria) => {
    if (isPadrao(categoria)) {
      Alert.alert("Aviso", "Categorias padrão não podem ser editadas");
      return;
    }
    setCategoriaParaEditar(categoria);
    setModalVisible(true);
  };

  const handleDeleteCategoria = (categoria) => {
    if (isPadrao(categoria)) {
      Alert.alert("Aviso", "Categorias padrão não podem ser deletadas");
      return;
    }

    Alert.alert(
      "Excluir Categoria",
      `Tem certeza que deseja excluir "${categoria.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deletarCategoria(categoria.id),
        },
      ],
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
      console.error("Erro ao salvar categoria:", error);
      return false;
    }
  };

  const renderCategoriaItem = ({ item }) => {
    const ehPadrao = isPadrao(item);

    return (
      <View style={styles.categoriaItem}>
        <View style={styles.categoriaInfo}>
          <View style={[styles.categoriaIcone, { backgroundColor: item.cor }]}>
            <MaterialIcons name={item.icone} size={24} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.categoriaNome}>{item.nome}</Text>
            {ehPadrao && <Text style={styles.categoriaBadge}>Padrão</Text>}
          </View>
        </View>
        {!ehPadrao && (
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
  };

  const handleSearchToggle = () => {
    if (searchExpanded) {
      setSearchQuery("");
    }
    setSearchExpanded(!searchExpanded);
  };

  return (
    <View style={styles.container}>
      {/* Header com busca expansível */}

      {!searchExpanded ? (
        <>
          <View style={styles.header}>
            <TituloPagina>Categorias</TituloPagina>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchToggle}
            >
              <MaterialIcons name="search" size={32} color="#333" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.headerHandleSearchExpanded}>
            <MaterialIcons
              name="search"
              size={24}
              color="#999"
              style={styles.searchIconExpanded}
            />
            <TextInput
              style={styles.searchInputExpanded}
              placeholder="Buscar Categoria"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={handleSearchToggle}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Toggle de Tipo */}
      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedType === "RECEITA" && styles.toggleButtonActive,
          ]}
          onPress={() => setSelectedType("RECEITA")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              selectedType === "RECEITA" && styles.toggleButtonTextActive,
            ]}
          >
            Receitas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedType === "GASTO" && styles.toggleButtonActive,
          ]}
          onPress={() => setSelectedType("GASTO")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              selectedType === "GASTO" && styles.toggleButtonTextActive,
            ]}
          >
            Despesas
          </Text>
        </TouchableOpacity>
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
      <BotaoFlutuanteAdicionar onPress={handleAddCategoria} iconSize={30} />

      {/* Modal de Adicionar/Editar */}
      <ModalCategoria
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setCategoriaParaEditar(null);
        }}
        onSave={handleSaveCategoria}
        categoria={categoriaParaEditar}
        tipoInicial={selectedType}
      />
    </View>
  );
};

export default TelaCategorias;
