import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLogoByName } from './logosInstituicoes';
import ModalConfirmDelete from './ModalConfirmDelete';
import ModalAviso from './ModalAviso';
import { getColorsByTheme } from '../../styles/colors';
import { useTheme } from '../../contexts/ThemeContext';

interface ModalEditarInstituicaoProps {
  visible: boolean;
  onClose: () => void;
  onSave: (instituicao: InstituicaoEdit) => void;
  onDelete: () => void;
  instituicao: InstituicaoEdit | null;
}

export interface InstituicaoEdit {
  id: string | number;
  nome: string;
  icone: string;
  cor: string;
  type: 'BANCO' | 'VALE';
}

const ModalEditarInstituicao: React.FC<ModalEditarInstituicaoProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  instituicao,
}) => {
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getStyles(isDarkMode);
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#E31C23');
  const [type, setType] = useState<'BANCO' | 'VALE'>('BANCO');
  const [showColorWheel, setShowColorWheel] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeletando, setIsDeletando] = useState(false);
  const [modalAviso, setModalAviso] = useState({ visible: false, titulo: '', mensagem: '' });

  const fecharAviso = () => setModalAviso((prev) => ({ ...prev, visible: false }));
  const mostrarAviso = (titulo: string, mensagem: string) => setModalAviso({ visible: true, titulo, mensagem });

  // Cores predefinidas organizadas em roda
  const coresPredefinidas = [
    '#E31C23', // Vermelho Santander
    '#FF4444', // Vermelho claro
    '#FF6B6B', // Vermelho salmão
    '#FF6600', // Laranja
    '#FF9500', // Laranja claro
    '#FFED00', // Amarelo
    '#FFD700', // Dourado
    '#00AB63', // Verde escuro
    '#21C25E', // Verde médio
    '#00E676', // Verde claro
    '#00D9E1', // Ciano
    '#009EE3', // Azul claro
    '#007AFF', // Azul iOS
    '#005CA9', // Azul escuro
    '#820AD1', // Roxo
    '#9C27B0', // Roxo médio
    '#E91E63', // Rosa
    '#CC092F', // Vermelho escuro
    '#8B4513', // Marrom
    '#666666', // Cinza
    '#000000', // Preto
    '#4A9EFF', // Azul contadin
  ];

  useEffect(() => {
    if (instituicao) {
      setNome(instituicao.nome);
      setCor(instituicao.cor);
      setType(instituicao.type);
    }
  }, [instituicao]);

  const handleSave = () => {
    if (!nome.trim()) {
      mostrarAviso('Nome obrigatório', 'Por favor, preencha o nome da instituição.');
      return;
    }
    
    if (instituicao) {
      onSave({
        ...instituicao,
        nome: nome.trim(),
        cor,
        type,
      });
    }
  };

  const handleDeleteConfirm = () => {
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeletando(true);
    try {
      await onDelete();
      setDeleteModalVisible(false);
    } catch (error) {
      console.error('Erro ao deletar instituição:', error);
      mostrarAviso('Erro', 'Não foi possível deletar a instituição');
    } finally {
      setIsDeletando(false);
    }
  };

  const renderIcone = () => {
    const logo = getLogoByName(instituicao?.nome || '');
    
    if (logo) {
      return (
        <View style={[styles.iconeGrande, { backgroundColor: COLORS.backgroundLight }]}>
          <Image 
            source={logo} 
            style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover' }}
            resizeMode="contain"
          />
        </View>
      );
    }
    
    return (
      <View style={[styles.iconeGrande, { backgroundColor: cor }]}>
        <Text style={styles.iconeTexto}>{instituicao?.icone}</Text>
      </View>
    );
  };

  return (
    <>
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
            {/* Botão de Excluir no Topo */}
            <TouchableOpacity 
              style={styles.botaoExcluir}
              onPress={handleDeleteConfirm}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.white} />
              <Text style={styles.textoExcluir}>Excluir instituição</Text>
            </TouchableOpacity>

            {/* Cabeçalho com Ícone */}
            <View style={styles.headerInstituicao}>
              {renderIcone()}
              <View style={styles.infoContainer}>
                <TextInput
                  style={styles.inputNome}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Nome da instituição"
                  placeholderTextColor={COLORS.textTertiary}
                />
              </View>
            </View>

            {/* Seção de Tipo */}
            <View style={styles.secao}>
              <Text style={styles.label}>Tipo de Instituição:</Text>
              <View style={styles.tipoButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.tipoButton,
                    type === 'BANCO' && styles.tipoButtonActive
                  ]}
                  onPress={() => setType('BANCO')}
                >
                  <Ionicons 
                    name="business" 
                    size={18} 
                    color={type === 'BANCO' ? COLORS.white : COLORS.textSecondary}
                  />
                  <Text style={[
                    styles.tipoButtonText,
                    type === 'BANCO' && styles.tipoButtonTextActive
                  ]}>Banco</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tipoButton,
                    type === 'VALE' && styles.tipoButtonActive
                  ]}
                  onPress={() => setType('VALE')}
                >
                  <Ionicons 
                    name="card" 
                    size={18} 
                    color={type === 'VALE' ? COLORS.white : COLORS.textSecondary}
                  />
                  <Text style={[
                    styles.tipoButtonText,
                    type === 'VALE' && styles.tipoButtonTextActive
                  ]}>Vale</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Seção de Cor com Roda de Cores */}
            <View style={styles.secao}>
              <Text style={styles.label}>Cor Destaque para a Instituição:</Text>
              
              {/* Botão executivo para escolher cor */}
              <TouchableOpacity 
                style={styles.seletorCorExecutivo}
                onPress={() => setShowColorWheel(!showColorWheel)}
                activeOpacity={0.7}
              >
                <View style={styles.corPreviewContainer}>
                  <View style={[styles.corPreviewCirculo, { backgroundColor: cor }]} />
                  <View style={styles.corInfoContainer}>
                    <Text style={styles.corNomeLabel}>Cor Selecionada</Text>
                    <Text style={styles.corHexCode}>{cor.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.alterarCorContainer}>
                  <Text style={styles.alterarCorTexto}>Alterar</Text>
                  <Ionicons 
                    name={showColorWheel ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color={COLORS.textSecondary} 
                  />
                </View>
              </TouchableOpacity>

              {/* Roda de Cores */}
              {showColorWheel && (
                <View style={styles.rodaDeCores}>
                  <View style={styles.gridCores}>
                    {coresPredefinidas.map((corOpcao, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.opcaoCor,
                          { backgroundColor: corOpcao },
                          cor === corOpcao && styles.corSelecionadaBorda,
                        ]}
                        onPress={() => {
                          setCor(corOpcao);
                          setShowColorWheel(false);
                        }}
                      >
                        {cor === corOpcao && (
                          <View style={styles.checkContainer}>
                            <Ionicons name="checkmark" size={20} color={COLORS.white} />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Botões de Ação */}
            <View style={styles.botoesAcao}>
              <TouchableOpacity 
                style={styles.botaoCancelar}
                onPress={onClose}
              >
                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.botaoConfirmar,
                  !nome.trim() && styles.botaoConfirmarDesabilitado,
                ]}
                onPress={handleSave}
                disabled={!nome.trim()}
              >
                <Text style={styles.textoBotaoConfirmar}>Salvar Alterações</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
      <ModalConfirmDelete
        visible={deleteModalVisible}
        titulo="Excluir Instituição"
        mensagem={`Tem certeza que deseja excluir "${instituicao?.nome}"?\n\n⚠️ Atenção: Todas as transações vinculadas a esta instituição serão permanentemente deletadas.`}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalVisible(false)}
        isLoading={isDeletando}
      />
    </Modal>

      <ModalAviso
        visible={modalAviso.visible}
        titulo={modalAviso.titulo}
        mensagem={modalAviso.mensagem}
        onClose={fecharAviso}
      />
    </>
  );
};

const getStyles = (isDarkMode: boolean) => {
  const COLORS = getColorsByTheme(isDarkMode);

  return StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.backgroundLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.borderLight,
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
  botaoExcluir: {
    backgroundColor: COLORS.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  textoExcluir: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerInstituicao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  iconeGrande: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconeTexto: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  infoContainer: {
    flex: 1,
    gap: 8,
  },
  inputNome: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  botaoAlterarIcone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 24,
    gap: 8,
  },
  textoAlterarIcone: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  textoEmBreve: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
  },
  secao: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  tipoButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tipoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  tipoButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tipoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tipoButtonTextActive: {
    color: COLORS.white,
  },
  seletorCorExecutivo: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: COLORS.black,
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
    borderColor: COLORS.background,
    shadowColor: COLORS.black,
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
    color: COLORS.textTertiary,
    fontWeight: '500',
    marginBottom: 2,
  },
  corHexCode: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
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
    color: COLORS.textSecondary,
  },
  rodaDeCores: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gridCores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  opcaoCor: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  corSelecionadaBorda: {
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    transform: [{ scale: 1.1 }],
  },
  checkContainer: {
    backgroundColor: COLORS.black,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botoesAcao: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  botaoCancelar: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBotaoCancelar: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  botaoConfirmar: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  botaoConfirmarDesabilitado: {
    backgroundColor: COLORS.primaryLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  textoBotaoConfirmar: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  });
};

export default ModalEditarInstituicao;
