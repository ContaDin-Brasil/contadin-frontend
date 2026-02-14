/**
 * Hook para gerenciar edição de perfil
 */
import { useState } from 'react';
import { PerfilUsuario } from '../types/configuracoes.types';
import { PERFIL_INICIAL } from '../constants/constantesConfiguracao';

export const useEditarPerfil = () => {
  const [nome, setNome] = useState(PERFIL_INICIAL.nome);
  const [sobrenome, setSobrenome] = useState(PERFIL_INICIAL.sobrenome);
  const [tel, setTel] = useState(PERFIL_INICIAL.tel);
  const [email, setEmail] = useState(PERFIL_INICIAL.email);
  const [pushNotifications, setPushNotifications] = useState(PERFIL_INICIAL.pushNotifications);
  const [darkTheme, setDarkTheme] = useState(PERFIL_INICIAL.darkTheme);

  const handleSaveProfile = () => {
    const perfil: PerfilUsuario = {
      nome,
      sobrenome,
      tel,
      email,
      pushNotifications,
      darkTheme
    };
    
    // Implementar lógica de salvar alterações
    console.log('Perfil atualizado:', perfil);
  };

  return {
    nome,
    setNome,
    sobrenome,
    setSobrenome,
    tel,
    setTel,
    email,
    setEmail,
    pushNotifications,
    setPushNotifications,
    darkTheme,
    setDarkTheme,
    handleSaveProfile
  };
};
