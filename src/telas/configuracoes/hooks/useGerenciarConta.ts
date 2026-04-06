/**
 * Hook para gerenciar conta (exclusão, desativação)
 */
import { useState } from 'react';
import { Alert } from 'react-native';
import { usuarioService } from '../../../api';
import { useAuth } from '../../../contexts/AuthContext';

interface UsuarioAuth {
  id?: string | number;
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string; mensagem?: string } } }).response;
    if (response?.data?.message) return response.data.message;
    if (response?.data?.mensagem) return response.data.mensagem;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Não foi possível desativar a conta. Tente novamente.';
};

export const useGerenciarConta = () => {
  const { user, logout } = useAuth();
  const userAuth = user as UsuarioAuth | null;

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [deactivatedModalVisible, setDeactivatedModalVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleDeleteAccount = () => {
    setDeleteModalVisible(false);
    setConfirmDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (isDeactivating) return;

    if (deleteConfirmText.toLowerCase() !== 'excluir') {
      Alert.alert('Confirmação inválida', 'Digite "excluir" para continuar.');
      return;
    }

    if (!userAuth?.id) {
      Alert.alert('Erro', 'Não foi possível identificar o usuário logado.');
      return;
    }

    try {
      setIsDeactivating(true);
      await usuarioService.desativar(userAuth.id);
      setConfirmDeleteModalVisible(false);
      setDeleteConfirmText('');
      setDeactivatedModalVisible(true);
    } catch (error) {
      Alert.alert('Erro ao desativar conta', getErrorMessage(error));
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleFinalConfirm = async () => {
    setDeactivatedModalVisible(false);
    await logout();
  };

  const handleCloseConfirmModal = () => {
    setConfirmDeleteModalVisible(false);
    setDeleteConfirmText('');
  };

  return {
    deleteModalVisible,
    setDeleteModalVisible,
    confirmDeleteModalVisible,
    setConfirmDeleteModalVisible,
    deactivatedModalVisible,
    setDeactivatedModalVisible,
    deleteConfirmText,
    setDeleteConfirmText,
    isDeactivating,
    handleDeleteAccount,
    handleConfirmDelete,
    handleFinalConfirm,
    handleCloseConfirmModal
  };
};
