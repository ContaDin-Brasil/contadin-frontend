import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import TituloPagina from '../../componentes/TituloPagina';
import InstitutionSelectionModal from '../../componentes/modais/ModalSelecaoInstituicao';
import AddCustomInstitutionModal from '../../componentes/modais/ModalAdicionarInstituicao';
import ModalEditarInstituicao from '../../componentes/modais/ModalEditarInstituicao';
import { useEditarBancos } from './hooks/useEditarInstituicoes';
import { getLogoByName } from '../../componentes/modais/logosInstituicoes';
import { confirmarAcao } from '../../utils/confirmarAcao';
import { styles } from './styles/TelaEditarBancos.styles';

const EditBanksScreen = ({ navigation }) => {
  const editor = useEditarBancos();

  // Recarrega bancos quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      editor.carregarBancos();
    }, [])
  );

  const handleDeleteConfirm = (bank) => {
    const mensagem = `Tem certeza que deseja excluir "${bank.nome}"?\n\n⚠️ Atenção: Todas as transações vinculadas a esta instituição serão permanentemente deletadas.`;

    confirmarAcao({
      titulo: 'Excluir Instituição',
      mensagem,
      textoConfirmar: 'Excluir',
      onConfirmar: () => editor.handleDelete(bank.id),
    });
  };

  const renderIcon = (text, color, institutionName) => {
    const logo = getLogoByName(institutionName);
    
    return (
      <View style={[styles.iconContainer, { backgroundColor: logo ? '#FFF' : color }]}>
        {logo ? (
          <Image 
            source={logo} 
            style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 8 }}
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
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.header}>
          <TituloPagina 
            mostrarBotaoVoltar={true} 
            onVoltar={() => navigation.goBack()}
            style={{ marginTop: 0, marginBottom: 0 }}
          >
            Editar Bancos
          </TituloPagina>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8A05BE" />
          <Text style={{ marginTop: 16, color: '#666' }}>Carregando bancos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina 
        mostrarBotaoVoltar={true} 
        onVoltar={() => navigation.goBack()}
      >
        Editar Bancos
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>

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
                  e?.stopPropagation?.();
                  handleDeleteConfirm(bank);
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
        availableInstitutions={editor.availableBanks}
      />

      <AddCustomInstitutionModal
        visible={editor.customModalVisible}
        onClose={() => editor.setCustomModalVisible(false)}
        onAdd={editor.handleAddCustom}
        tipoInicial="banco"
      />

      {/* Modal de Edição */}
      <ModalEditarInstituicao
        visible={editor.editModalVisible}
        onClose={() => editor.setEditModalVisible(false)}
        onSave={editor.handleUpdate}
        onDelete={async () => {
          if (!editor.selectedBank) {
            return;
          }

          await editor.handleDelete(editor.selectedBank.id);
          editor.setEditModalVisible(false);
        }}
        instituicao={editor.selectedBank ? {
          id: editor.selectedBank.id,
          nome: editor.selectedBank.nome,
          icone: editor.selectedBank.icone,
          cor: editor.selectedBank.cor,
          tipoInstituicao: 'banco',
        } : null}
      />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditBanksScreen;
