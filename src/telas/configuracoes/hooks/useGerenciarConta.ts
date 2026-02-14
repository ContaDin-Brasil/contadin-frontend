/**
 * Hook para gerenciar conta (exclusão, desativação)
 */
import { useState } from 'react';

export const useGerenciarConta = () => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [deactivatedModalVisible, setDeactivatedModalVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleDeleteAccount = () => {
    setDeleteModalVisible(false);
    setConfirmDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText.toLowerCase() === 'excluir') {
      setConfirmDeleteModalVisible(false);
      setDeactivatedModalVisible(true);
    }
  };

  const handleFinalConfirm = () => {
    setDeactivatedModalVisible(false);
    // Implementar lógica de exclusão/desativação aqui
    console.log('Conta desativada');
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
    handleDeleteAccount,
    handleConfirmDelete,
    handleFinalConfirm,
    handleCloseConfirmModal
  };
};
