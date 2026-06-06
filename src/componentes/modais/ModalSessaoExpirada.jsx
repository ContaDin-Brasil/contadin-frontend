import React from 'react';
import ModalAviso from './ModalAviso';

const ModalSessaoExpirada = ({ visible, onClose }) => {
  return (
    <ModalAviso
      visible={visible}
      onClose={onClose}
      titulo="Sessão expirada"
      mensagem="Faça login novamente."
      textoOk="Fazer login"
    />
  );
};

export default ModalSessaoExpirada;
