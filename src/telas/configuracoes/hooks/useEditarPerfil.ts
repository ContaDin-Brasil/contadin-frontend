/**
 * Hook para gerenciar edição de perfil
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { usuarioService } from '../../../api';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { PerfilUsuario } from '../types/configuracoes.types';
import { PERFIL_INICIAL, validarNome, validarSobrenome, validarEmail, validarTelefone } from '../constants/constantesConfiguracao';
import { apenasDigitosTelefone, formatarTelefone } from '../../../utils/mascaraTelefone';
import type { UsuarioApi, UsuarioAutenticado } from '../../../api/types';

interface UsuarioComId {
  id?: string | number;
  nome?: string | null;
  sobrenome?: string | null;
  email?: string;
  telefone?: string | null;
}

interface PerfilSnapshot {
  nome: string;
  sobrenome: string;
  telefone: string;
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

const normalizarUsuarioAutenticado = (
  usuarioAtualizado: UsuarioApi,
  fallback: {
    id: string | number;
    nome: string;
    sobrenome: string;
    email: string;
  },
): UsuarioAutenticado => ({
  id: usuarioAtualizado.id ?? fallback.id,
  nome: usuarioAtualizado.nome ?? fallback.nome,
  sobrenome: usuarioAtualizado.sobrenome ?? fallback.sobrenome,
  email: usuarioAtualizado.email ?? fallback.email,
});

export const useEditarPerfil = () => {
  const { user, updateUser } = useAuth();
  const { setTheme } = useTheme();

  const [nome, setNome] = useState(PERFIL_INICIAL.nome);
  const [sobrenome, setSobrenome] = useState(PERFIL_INICIAL.sobrenome);
  const [telefone, setTelefone] = useState(PERFIL_INICIAL.telefone);
  const [email, setEmail] = useState(PERFIL_INICIAL.email);
  const [pushNotifications, setPushNotifications] = useState(PERFIL_INICIAL.pushNotifications);
  const [darkTheme, setDarkThemeLocal] = useState(PERFIL_INICIAL.darkTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState<PerfilSnapshot>({
    nome: PERFIL_INICIAL.nome,
    sobrenome: PERFIL_INICIAL.sobrenome,
    telefone: apenasDigitosTelefone(PERFIL_INICIAL.telefone),
    email: PERFIL_INICIAL.email,
    pushNotifications: PERFIL_INICIAL.pushNotifications,
    darkTheme: PERFIL_INICIAL.darkTheme,
  });

  // Estados para validação
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const userAuth = user as UsuarioComId | null;

  // Sincronizar mudanças de darkTheme com ThemeContext
  const handleSetDarkTheme = useCallback((value: boolean) => {
    setDarkThemeLocal(value);
    // Aplicar tema imediatamente ao ThemeContext
    setTheme(value ? 'dark' : 'light');
  }, [setTheme]);

  const normalizarSnapshot = useCallback((dados: PerfilSnapshot): PerfilSnapshot => {
    return {
      nome: dados.nome.trim(),
      sobrenome: dados.sobrenome.trim(),
      telefone: apenasDigitosTelefone(dados.telefone),
      email: dados.email.trim().toLowerCase(),
      pushNotifications: dados.pushNotifications,
      darkTheme: dados.darkTheme,
    };
  }, []);

  const preencherDadosPerfil = useCallback((perfil: UsuarioComId) => {
    const telefoneFormatado = formatarTelefone(perfil.telefone ?? '');
    const nomePerfil = perfil.nome ?? '';
    const sobrenomePerfil = perfil.sobrenome ?? '';
    const emailPerfil = perfil.email ?? '';

    setNome(nomePerfil);
    setSobrenome(sobrenomePerfil);
    setTelefone(telefoneFormatado);
    setEmail(emailPerfil);

    setInitialSnapshot(normalizarSnapshot({
      nome: nomePerfil,
      sobrenome: sobrenomePerfil,
      telefone: telefoneFormatado,
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
        telefone,
        email,
        pushNotifications,
        darkTheme,
      }),
    [darkTheme, email, nome, normalizarSnapshot, pushNotifications, sobrenome, telefone],
  );

  const isDirty = useMemo(() => {
    return JSON.stringify(currentSnapshot) !== JSON.stringify(initialSnapshot);
  }, [currentSnapshot, initialSnapshot]);

  const emailFoiAlterado = useMemo(() => {
    return currentSnapshot.email !== initialSnapshot.email;
  }, [currentSnapshot.email, initialSnapshot.email]);

  /**
   * Valida todos os campos de perfil
   * Retorna objeto com erros (vazio se válido)
   */
  const validarCampos = useCallback((): Record<string, string> => {
    const errors: Record<string, string> = {};

    const erroNome = validarNome(nome);
    if (erroNome) errors.nome = erroNome;

    const erroSobrenome = validarSobrenome(sobrenome);
    if (erroSobrenome) errors.sobrenome = erroSobrenome;

    const erroEmail = validarEmail(email);
    if (erroEmail) errors.email = erroEmail;

    const erroTelefone = validarTelefone(telefone);
    if (erroTelefone) errors.telefone = erroTelefone;

    return errors;
  }, [nome, sobrenome, email, telefone]);

  /**
   * Atualiza erros de validação em tempo real
   */
  useEffect(() => {
    const erros = validarCampos();
    setValidationErrors(erros);
  }, [validarCampos]);

  const handleChangeTelefone = useCallback((texto: string) => {
    setTelefone(formatarTelefone(texto));
  }, []);

  const handleSaveProfile = async () => {
    if (!userAuth?.id || isSaving || !isDirty) {
      return;
    }

    // Valida campos antes de salvar
    const erros = validarCampos();
    if (Object.keys(erros).length > 0) {
      setValidationErrors(erros);
      Alert.alert('Erro', 'Por favor, corrija os erros nos campos antes de salvar.');
      return;
    }

    setIsSaving(true);

    const perfil: PerfilUsuario = {
      nome,
      sobrenome,
      telefone: apenasDigitosTelefone(telefone),
      email,
      pushNotifications,
      darkTheme
    };

    try {
      // Atualiza todos os dados, incluindo email
      const usuarioAtualizado = await usuarioService.atualizarCadastro(userAuth.id, {
        nome: perfil.nome,
        sobrenome: perfil.sobrenome,
        telefone: perfil.telefone,
        email: perfil.email, // Email agora é atualizado
      });

      await updateUser(normalizarUsuarioAutenticado(usuarioAtualizado, {
        id: userAuth.id,
        nome: perfil.nome.trim(),
        sobrenome: perfil.sobrenome.trim(),
        email: perfil.email.trim(),
      }));

      setTelefone(formatarTelefone(usuarioAtualizado.telefone ?? perfil.telefone));
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
    telefone,
    setTelefone: handleChangeTelefone,
    email,
    setEmail,
    pushNotifications,
    setPushNotifications,
    darkTheme,
    setDarkTheme: handleSetDarkTheme,
    isLoading,
    isSaving,
    isDirty,
    emailFoiAlterado,
    handleSaveProfile,
    validationErrors
  };
};
