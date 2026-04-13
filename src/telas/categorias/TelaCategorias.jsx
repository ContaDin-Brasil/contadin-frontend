import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../styles/colors";
import { styles } from "./style/TelaCategorias.styles";
import { useGerenciarCategorias } from "../categorias/hooks/useGerenciarCategorias";
import ModalCategoria from "../categorias/modals/ModalCategoria";
import ModalConfirmDelete from "../../componentes/modais/ModalConfirmDelete";
import ModalAviso from "../../componentes/modais/ModalAviso";
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
    isCategoriaProtegida,
  } = useGerenciarCategorias();

  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [categoriaDeletando, setCategoriaDeletando] = useState(null);
  const [isDeletando, setIsDeletando] = useState(false);
  const [avisoModalVisible, setAvisoModalVisible] = useState(false);
  const [avisoMensagem, setAvisoMensagem] = useState("");

  const handleAddCategoria = () => {
    setCategoriaParaEditar(null);
    setModalVisible(true);
  };

  const handleEditCategoria = (categoria) => {
    if (isCategoriaProtegida(categoria)) {
      setAvisoMensagem("Categorias do sistema não podem ser editadas");
      setAvisoModalVisible(true);
      return;
    }
    setCategoriaParaEditar(categoria);
    setModalVisible(true);
  };

  const handleDeleteCategoria = (categoria) => {
    console.log('handleDeleteCategoria chamado:', categoria);
    if (isCategoriaProtegida(categoria)) {
      setAvisoMensagem("Categorias do sistema não podem ser deletadas");
      setAvisoModalVisible(true);
      return;
    }
    console.log('Abrindo modal de deleção para:', categoria.nome);
    setCategoriaDeletando(categoria);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoriaDeletando) return;
    
    setIsDeletando(true);
    try {
      await deletarCategoria(categoriaDeletando.id);
      setDeleteModalVisible(false);
      setCategoriaDeletando(null);
      setIsDeletando(false);
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      setDeleteModalVisible(false);
      setIsDeletando(false);
      setAvisoMensagem(error.message || 'Não foi possível deletar a categoria');
      setAvisoModalVisible(true);
    }
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
    const ehPadrao = isCategoriaProtegida(item);

    return (
      <View style={styles.categoriaItem}>
        <View style={styles.categoriaInfo}>
          <View style={[styles.categoriaIcone, { backgroundColor: item.cor }]}>
            <MaterialIcons name={item.icone} size={24} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.categoriaNome}>{item.nome}</Text>
            {ehPadrao && <Text style={styles.categoriaBadge}>Sistema</Text>}
          </View>
        </View>
        {!ehPadrao && (
          <View style={styles.categoriaActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditCategoria(item)}
            >
              <MaterialIcons name="edit" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteCategoria(item)}
            >
              <MaterialIcons name="delete" size={20} color={COLORS.error} />
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
    <>
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
                <MaterialIcons name="search" size={32} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.headerHandleSearchExpanded}>
              <MaterialIcons
                name="search"
                size={24}
                color={COLORS.textTertiary}
                style={styles.searchIconExpanded}
              />
              <TextInput
                style={styles.searchInputExpanded}
                placeholder="Buscar Categoria"
                placeholderTextColor={COLORS.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <TouchableOpacity onPress={handleSearchToggle}>
                <MaterialIcons name="close" size={24} color={COLORS.textPrimary} />
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
            <ActivityIndicator size="large" color={COLORS.textPrimary} />
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
                <MaterialIcons name="category" size={48} color={COLORS.textDisabled} />
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

        {/* Modal de Aviso */}
        <ModalAviso
          visible={avisoModalVisible}
          titulo="Aviso"
          mensagem={avisoMensagem}
          onClose={() => setAvisoModalVisible(false)}
        />
      </View>

      {/* Modal de Confirmar Deleção - Fora da View Principal */}
      <ModalConfirmDelete
        visible={deleteModalVisible}
        titulo="Excluir Categoria"
        mensagem={`Tem certeza que deseja excluir "${categoriaDeletando?.nome}"?\n\n⚠️ Atenção: Todas as transações vinculadas a esta categoria serão permanentemente deletadas.`}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteModalVisible(false);
          setCategoriaDeletando(null);
        }}
        isLoading={isDeletando}
      />
    </>
  );
};

export default TelaCategorias;
