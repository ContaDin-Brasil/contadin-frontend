/**
 * Script de manutenção para limpar transações órfãs
 * Executa a limpeza de transações que referenciam instituições inexistentes
 */

import { instituicaoService } from '../api';
import type { ResultadoLimpezaOrfaos } from '../api';

/**
 * Limpa todas as transações órfãs do usuário
 * @param {number} usuarioId - ID do usuário
 */
export const limparDadosOrfaos = async (usuarioId = 1): Promise<ResultadoLimpezaOrfaos> => {
  console.log('🧹 Iniciando limpeza de dados órfãos...\n');
  
  try {
    const resultado = await instituicaoService.limparTransacoesOrfas(usuarioId);
    
    if (resultado.deletadas > 0) {
      console.log(`✅ Limpeza concluída: ${resultado.deletadas} transações órfãs removidas`);
      console.log('\n📋 Transações removidas:');
      resultado.transacoesOrfas.forEach((t) => {
        console.log(`  • ID ${t.id}: ${t.descricao} (instituição ${t.fk_instituicao})`);
      });
    } else {
      console.log('✅ Nenhuma transação órfã encontrada. Banco de dados está limpo!');
    }
    
    return resultado;
  } catch (error) {
    console.error('❌ Erro ao limpar dados órfãos:', error);
    throw error;
  }
};

/**
 * Hook para usar a limpeza em componentes React
 */
export const useLimparDadosOrfaos = () => {
  const executarLimpeza = async (usuarioId = 1): Promise<ResultadoLimpezaOrfaos> => {
    return await limparDadosOrfaos(usuarioId);
  };
  
  return { executarLimpeza };
};
