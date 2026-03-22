/**
 * Hook para gerenciar edição de perfil
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { usuarioService } from '../../../api';
import { useAuth } from '../../../contexts/AuthContext';
import { PerfilUsuario } from '../types/configuracoes.types';
import { PERFIL_INICIAL } from '../constants/constantesConfiguracao';
import { apenasDigitosTelefone, formatarTelefone } from '../../../utils/mascaraTelefone';

interface UsuarioComId {
  id?: number;
  nome?: string;
  sobrenome?: string;
  email?: string;
  tel?: string;
}

interface PerfilSnapshot {
  nome: string;
  sobrenome: string;
  tel: string;
  email: string;
  pushNotifications: boolean;
  darkTheme: boolean;
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
};

export const useEditarPerfil = () => {
  const { user, updateUser } = useAuth();

  const [nome, setNome] = useState(PERFIL_INICIAL.nome);
  const [sobrenome, setSobrenome] = useState(PERFIL_INICIAL.sobrenome);
  const [tel, setTel] = useState(PERFIL_INICIAL.tel);
  const [email, setEmail] = useState(PERFIL_INICIAL.email);
  const [pushNotifications, setPushNotifications] = useState(PERFIL_INICIAL.pushNotifications);
  const [darkTheme, setDarkTheme] = useState(PERFIL_INICIAL.darkTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState<PerfilSnapshot>({
    nome: PERFIL_INICIAL.nome,
    sobrenome: PERFIL_INICIAL.sobrenome,
    tel: apenasDigitosTelefone(PERFIL_INICIAL.tel),
    email: PERFIL_INICIAL.email,
    pushNotifications: PERFIL_INICIAL.pushNotifications,
    darkTheme: PERFIL_INICIAL.darkTheme,
  });

  const userAuth = user as UsuarioComId | null;

  const normalizarSnapshot = useCallback((dados: PerfilSnapshot): PerfilSnapshot => {
    return {
      nome: dados.nome.trim(),
      sobrenome: dados.sobrenome.trim(),
      tel: apenasDigitosTelefone(dados.tel),
      email: dados.email.trim().toLowerCase(),
      pushNotifications: dados.pushNotifications,
      darkTheme: dados.darkTheme,
    };
  }, []);

  const preencherDadosPerfil = useCallback((perfil: UsuarioComId) => {
    const telFormatado = formatarTelefone(perfil.tel ?? '');
    const nomePerfil = perfil.nome ?? '';
    const sobrenomePerfil = perfil.sobrenome ?? '';
    const emailPerfil = perfil.email ?? '';

    setNome(nomePerfil);
    setSobrenome(sobrenomePerfil);
    setTel(telFormatado);
    setEmail(emailPerfil);

    setInitialSnapshot(normalizarSnapshot({
      nome: nomePerfil,
      sobrenome: sobrenomePerfil,
      tel: telFormatado,
      email: emailPerfil,
      pushNotifications: PERFIL_INICIAL.pushNotifications,
      darkTheme: PERFIL_INICIAL.darkTheme,
    }));
  }, [normalizarSnapshot]);

  useEffect(() => {
    const carregarPerfil = async () => {
      if (!userAuth?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const perfil = await usuarioService.buscarPorId(userAuth.id);
        preencherDadosPerfil(perfil);
      } catch (error) {
        Alert.alert('Erro ao carregar perfil', getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    carregarPerfil();
  }, [preencherDadosPerfil, userAuth?.id]);

  const currentSnapshot = useMemo(
    () =>
      normalizarSnapshot({
        nome,
        sobrenome,
        tel,
        email,
        pushNotifications,
        darkTheme,
      }),
    [darkTheme, email, nome, normalizarSnapshot, pushNotifications, sobrenome, tel],
  );

  const isDirty = useMemo(() => {
    return JSON.stringify(currentSnapshot) !== JSON.stringify(initialSnapshot);
  }, [currentSnapshot, initialSnapshot]);

  const emailFoiAlterado = useMemo(() => {
    return currentSnapshot.email !== initialSnapshot.email;
  }, [currentSnapshot.email, initialSnapshot.email]);

  const handleChangeTelefone = useCallback((texto: string) => {
    setTel(formatarTelefone(texto));
  }, []);

  const handleSaveProfile = async () => {
    if (!userAuth?.id || isSaving || !isDirty) {
      return;
    }

    setIsSaving(true);

    const perfil: PerfilUsuario = {
      nome,
      sobrenome,
      tel: apenasDigitosTelefone(tel),
      email,
      pushNotifications,
      darkTheme
    };

    try {
      const usuarioAtualizado = await usuarioService.atualizarParcial(userAuth.id, {
        nome: perfil.nome,
        sobrenome: perfil.sobrenome,
        tel: perfil.tel,
        email: perfil.email,
      });

      await updateUser({
        ...(userAuth ?? {}),
        ...usuarioAtualizado,
      });

      setTel(formatarTelefone(usuarioAtualizado.tel ?? perfil.tel));
      setInitialSnapshot(currentSnapshot);

      Alert.alert('Perfil atualizado', 'Suas alterações foram salvas com sucesso.');
    } catch (error) {
      Alert.alert('Erro ao salvar perfil', getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    nome,
    setNome,
    sobrenome,
    setSobrenome,
    tel,
    setTel: handleChangeTelefone,
    email,
    setEmail,
    pushNotifications,
    setPushNotifications,
    darkTheme,
    setDarkTheme,
    isLoading,
    isSaving,
    isDirty,
    emailFoiAlterado,
    handleSaveProfile
  };
};
