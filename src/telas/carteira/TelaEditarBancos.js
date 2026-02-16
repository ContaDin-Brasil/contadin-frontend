import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import CustomModal from '../../componentes/modais/ModalBase';
import InstitutionSelectionModal from '../../componentes/modais/ModalSelecaoInstituicao';
import AddCustomInstitutionModal from '../../componentes/modais/ModalAdicionarInstituicao';
import { useEditarBancos } from './hooks/useEditarInstituicoes';
import { getLogoByName } from '../../componentes/modais/logosInstituicoes';
import { styles } from './styles/TelaEditarBancos.styles';

const EditBanksScreen = ({ navigation }) => {
  const editor = useEditarBancos();

  // Recarrega bancos quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      editor.carregarBancos();
    }, [])
  );

  const renderIcon = (text, color, institutionName) => {
    const logo = getLogoByName(institutionName);
    
    return (
      <View style={[styles.iconContainer, { backgroundColor: logo ? '#FFF' : color }]}>
        {logo ? (
          <Image 
            source={logo} 
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.iconText}>{text}</Text>
        )}
      </View>
    );
  };

  // Mostra loading
  if (editor.loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Editar Bancos</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8A05BE" />
          <Text style={{ marginTop: 16, color: '#666' }}>Carregando bancos...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Bancos</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={24} color="#000" />
          <View style={styles.sectionTitleText}>
            <Text style={styles.sectionTitle}>Contas Bancárias</Text>
            <Text style={styles.sectionSubtitle}>Valor das faturas: R$ 0,00</Text>
          </View>
        </View>

        <View style={styles.banksList}>
          {editor.banks.map((bank) => (
            <TouchableOpacity 
              key={bank.id} 
              style={styles.bankItem}
              onPress={() => editor.handleEdit(bank)}
              activeOpacity={0.7}
            >
              <View style={styles.bankInfo}>
                {renderIcon(bank.icone, bank.cor, bank.nome)}
                <View style={styles.bankDetails}>
                  <Text style={styles.bankName}>{bank.nome}</Text>
                  <Text style={styles.bankBalance}>Saldo Atual: {bank.balance}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  editor.handleDelete(bank.id);
                }}
              >
                <Ionicons name="trash-outline" size={22} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => editor.setSelectionModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <InstitutionSelectionModal
        visible={editor.selectionModalVisible}
        onClose={() => editor.setSelectionModalVisible(false)}
        onSelectInstitution={editor.handleSelectInstitution}
        onAddCustom={editor.handleAddCustomInstitution}
        tipo="banco"
        existingInstitutions={editor.banks}
      />

      <AddCustomInstitutionModal
        visible={editor.customModalVisible}
        onClose={() => editor.setCustomModalVisible(false)}
        onAdd={editor.handleAddCustom}
      />

      {/* Edit Modal */}
      <CustomModal
        visible={editor.editModalVisible}
        onClose={() => editor.setEditModalVisible(false)}
        title=""
        showButtons={false}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.deleteInstitutionButton}
            onPress={() => {
              editor.handleDelete(editor.selectedBank?.id);
              editor.setEditModalVisible(false);
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#FFF" />
            <Text style={styles.deleteInstitutionText}>Excluir instituição</Text>
          </TouchableOpacity>

          <View style={styles.institutionHeader}>
            <View style={[styles.institutionIconLarge, { backgroundColor: editor.selectedBank?.cor }]}>
              <Text style={styles.institutionIconText}>{editor.selectedBank?.icone}</Text>
            </View>
            <Text style={styles.institutionName}>{editor.selectedBank?.nome}</Text>
            <Ionicons name="create-outline" size={20} color="#000" />
          </View>

          <Text style={styles.changeIconText}>Alterar ícone</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Instituição:</Text>
            <TextInput style={styles.input} placeholder="" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Cor Destaque para a Instituição:</Text>
            <View style={[styles.colorPicker, { backgroundColor: editor.selectedBank?.cor }]}>
              <Ionicons name="create-outline" size={24} color="#FFF" />
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => editor.setEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => editor.setEditModalVisible(false)}
            >
              <Text style={styles.confirmButtonText}>Confirmar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>
    </ScrollView>
  );
};

export default EditBanksScreen;
