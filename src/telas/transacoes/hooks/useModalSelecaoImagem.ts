/**
 * Hook para gerenciar modal de seleção de imagem
 * Complementa useCaptureImage com gerenciamento de estado do modal
 */

import { useState } from 'react';

export const useModalSelecaoImagem = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const abrirModal = () => {
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
  };

  return {
    modalVisible,
    abrirModal,
    fecharModal,
  };
};
