/**
 * Hook para gerenciar alteração de senha
 */
import { useState } from 'react';
import { AlterarSenha, ValidacaoSenha } from '../types/configuracoes.types';

export const useAlterarSenha = () => {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  /**
   * Valida a nova senha de acordo com os requisitos
   */
  const validarSenha = (senha: string): ValidacaoSenha => {
    return {
      temOitoCaracteres: senha.length >= 8,
      temNumero: /\d/.test(senha),
      temCaractereEspecial: /[!@$%&]/.test(senha),
      semSequenciaNumerica: !/(?:012|123|234|345|456|567|678|789|321|210|432|543|654|765|876|987)/.test(senha),
      semNumerosRepetidos: !/(\d)\1{2,}/.test(senha)
    };
  };

  /**
   * Verifica se todas as validações passaram
   */
  const senhaValida = (): boolean => {
    const validacao = validarSenha(novaSenha);
    return Object.values(validacao).every(v => v === true) && 
           novaSenha === confirmarSenha;
  };

  const handleSavePassword = () => {
    if (!senhaValida()) {
      console.log('Senha inválida');
      return;
    }

    const dados: AlterarSenha = {
      senhaAtual,
      novaSenha,
      confirmarSenha
    };
    
    // Implementar lógica de alteração de senha
    console.log('Senha alterada:', dados);
  };

  return {
    senhaAtual,
    setSenhaAtual,
    novaSenha,
    setNovaSenha,
    confirmarSenha,
    setConfirmarSenha,
    validarSenha,
    senhaValida,
    handleSavePassword
  };
};
