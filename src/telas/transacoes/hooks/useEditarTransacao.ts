import { useState, useEffect } from 'react';
import { useFormularioTransacao } from './useFormularioTransacao';
import { transacaoService } from '../../../api';
import { parseTransacaoDate } from '../utils/utilitariosTransacao';
import type { TransacaoApi } from '../../../api/types';

type InstituicaoFormulario = ReturnType<typeof useFormularioTransacao>['instituicoes'][number];

/**
 * Hook customizado para gerenciar a edição de uma transação existente
 * Reutiliza useFormularioTransacao mas inicializa com dados da transação
 */
export const useEditarTransacao = (transacaoId: string | null) => {
  const formState = useFormularioTransacao();
  const [loadingTransacao, setLoadingTransacao] = useState(true);
  const [transacaoOriginal, setTransacaoOriginal] = useState<TransacaoApi | null>(null);

  /**
   * Aplica a instituição correta sempre que a transação ou a lista de instituições estiver disponível.
   */
  useEffect(() => {
    const fkInstId = transacaoOriginal?.fkInstituicao;

    if (!fkInstId || formState.instituicoes.length === 0) return;

    const instituicao = formState.instituicoes.find(
      (inst: InstituicaoFormulario) => String(inst.id) === String(fkInstId)
    );

    if (instituicao) {
      console.log('🏦 Instituição aplicada:', instituicao.nome);
      formState.handleSelectInstitution(instituicao);
      formState.setInstitutionType(
        instituicao.tipoInstituicao === 'VALE' ? 'vouchers' : 'banks'
      );
    } else {
      console.warn('⚠️ Instituição não encontrada para fkInstituicao:', fkInstId);
    }
  }, [transacaoOriginal, formState.instituicoes]);

  /**
   * Aplica a categoria correta sempre que a transação ou a lista de categorias estiver disponível.
   */
  useEffect(() => {
    const fkCatId = transacaoOriginal?.fkCategoria;

    if (!fkCatId || formState.categorias.length === 0) return;

    formState.setSelectedCategory(String(fkCatId));
  }, [transacaoOriginal, formState.categorias]);

  /**
   * Carrega os dados da transação para edição
   * Aguarda formState estar pronto (loading === false)
   */
  useEffect(() => {
    if (transacaoId && !formState.loading) {
      console.log('✅ [READY] formState pronto, carregando transação...');
      carregarTransacao();
    } else if (transacaoId && formState.loading) {
      console.log('⏳ [WAITING] Aguardando formState ficar pronto...');
    }
  }, [transacaoId, formState.loading]);

  /**
   * Monitor no estado de loading do formState
   */
  useEffect(() => {
    console.log('[MONITOR] formState.loading:', formState.loading, '| instituicoes:', formState.instituicoes.length);
  }, [formState.loading, formState.instituicoes.length]);

  const carregarTransacao = async () => {
    if (!transacaoId) {
      setLoadingTransacao(false);
      return;
    }

    setLoadingTransacao(true);
    
    try {
      console.log('\n' + '='.repeat(60));
      console.log('📖 [LOAD TRANSACTION] Carregando transação para edição');
      console.log('='.repeat(60));
      console.log('🆔 ID da transação:', transacaoId);
      console.log('🔄 formState.loading:', formState.loading);
      console.log('📦 formState.instituicoes.length:', formState.instituicoes.length);
      
      const transacao = await transacaoService.buscarPorId(transacaoId);
      
      console.log('✅ Transação buscada na API');
      console.log('📦 Dados recebidos:', JSON.stringify(transacao, null, 2));
      console.log('='.repeat(60) + '\n');
      
      setTransacaoOriginal(transacao);
      
      // Preenche o formulário com os dados da transação
      // As instituições já foram carregadas pelo useEffect de useFormularioTransacao
      await preencherFormulario(transacao);
      
    } catch (error) {
      console.error('❌ [LOAD ERROR] Erro ao carregar transação:', error);
    } finally {
      setLoadingTransacao(false);
    }
  };

  /**
   * Preenche o formulário com os dados da transação
   */
  const preencherFormulario = async (transacao: TransacaoApi) => {
    // ⏳ Aguarda até que as instituições estejam carregadas (formState.loading === false)
    // Isso evita race condition quando carregarDados() ainda está em progresso
    const maxWaitTime = 5000; // 5 segundos máximo
    const startTime = Date.now();
    
    while (formState.loading) {
      if (Date.now() - startTime > maxWaitTime) {
        console.warn('⚠️ [FILL FORM] Timeout esperando carregamento de instituições (5s)');
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log('✏️ [FILL FORM] Instituições carregadas! Preenchendo formulário...');
    console.log('   formState.loading:', formState.loading);
    console.log('   formState.instituicoes.length:', formState.instituicoes.length);
    
    // Descrição e tipo
    formState.setDescricao(transacao.descricao);
    formState.setTipo(transacao.tipo);
    
    // Valor - formata para exibição com duas casas decimais
    const valorNumerico = Number(transacao.valor);
    const valorFormatado = valorNumerico.toFixed(2).replace('.', ',');
    formState.setValor(valorFormatado);
    
    // Data - converte de ISO para DD/MM/YYYY
    const dataTransacao = parseTransacaoDate(transacao.dataTransacao);
    const dia = String(dataTransacao.getDate()).padStart(2, '0');
    const mes = String(dataTransacao.getMonth() + 1).padStart(2, '0');
    const ano = dataTransacao.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;
    formState.handleDateChange(dataFormatada);
    
    // Categoria
    if (transacao.fkCategoria) {
      formState.setSelectedCategory(String(transacao.fkCategoria));
    }

    // Categoria e instituição são aplicadas via useEffect que observa transacaoOriginal

    // Parcelamento
    if (transacao.parcelado) {
      formState.setIsInstallment(true);
    }
    
    // Recorrência
    if (transacao.recorrencia) {
      formState.setIsRecurring(true);
      formState.setFrequency(transacao.recorrencia);
      
      // Data fim de recorrência - backend retorna "dd/MM/yyyy"
      if (transacao.fimRecorrencia) {
        formState.setHasRecurrenceEndDate(true);
        const fimRaw = String(transacao.fimRecorrencia);
        const fimPart = fimRaw.includes(' ') ? fimRaw.split(' ')[0] : fimRaw;
        const fimPartes = fimPart.split('/');
        const fimFormatado = fimPartes.length === 3 && fimPartes[0].length === 2
          ? fimPart
          : fimPartes.reverse().join('/');
        formState.handleRecurrenceEndDateChange(fimFormatado);
      }
    }
    
    // Instituição - agora as instituições já estão carregadas no formState
    if (transacao.fkInstituicao) {
      console.log('🏦 [INSTITUTION] Buscando instituição com ID:', transacao.fkInstituicao);
      console.log('   Instituições disponíveis no formState:', formState.instituicoes.length);
      console.log('   IDs:', formState.instituicoes.map((i: InstituicaoFormulario) => i.id).join(', '));
      
      const instituicao = formState.instituicoes.find(
        (inst: InstituicaoFormulario) => String(inst.id) === String(transacao.fkInstituicao)
      );
      
      if (instituicao) {
        console.log('✅ [INSTITUTION] Instituição encontrada:', instituicao.nome);
        formState.handleSelectInstitution(instituicao);
        
        // Define o tipo de instituição correto
        if (instituicao.tipoInstituicao === 'VALE') {
          formState.setInstitutionType('vouchers');
        } else {
          formState.setInstitutionType('banks');
        }
      } else {
        console.warn('⚠️ [INSTITUTION] Instituição não encontrada no array:', transacao.fkInstituicao);
        console.warn(
          '   Instituições disponíveis:',
          formState.instituicoes.map((i: InstituicaoFormulario) => `${i.id}:${i.nome}`).join(', '),
        );
      }
    } else {
      console.log('ℹ️ [INSTITUTION] Transação não tem instituição associada');
    }
    
    console.log('✅ Formulário preenchido com sucesso');
  };

  /**
   * Atualiza a transação no banco
   */
  const atualizarTransacao = async () => {
    if (!transacaoId) {
      throw new Error('ID da transação não definido');
    }

    const data = formState.getFormData();
    
    // Valida dados básicos
    if (!data.descricao || !data.valor) {
      throw new Error('Preencha descrição e valor');
    }

    if (!data.selectedInstitution) {
      throw new Error('Selecione uma instituição');
    }

    // Converte data DD/MM/YYYY para o formato esperado pelo backend: yyyy-MM-dd'T'HH:mm:ss
    const [day, month, year] = data.date.split('/');
    const dataTransacao = `${year}-${month}-${day}T00:00:00`;

    // Converte data fim de recorrência para yyyy-MM-dd (sem horário)
    let fimRecorrencia = null;
    if (data.hasRecurrenceEndDate && data.recurrenceEndDate) {
      const [endDay, endMonth, endYear] = data.recurrenceEndDate.split('/');
      fimRecorrencia = `${endYear}-${endMonth}-${endDay}`;
    }

    // Prepara dados para envio (campos em camelCase conforme TransacaoRequest)
    const transacaoAtualizada = {
      descricao: data.descricao,
      valor: data.valor,
      tipo: data.tipo,
      dataTransacao,
      parcelado: data.parcelado,
      recorrencia: data.frequency ?? null,
      fimRecorrencia,
      ativo: true,
      fkInstituicao: String(data.selectedInstitution.id),
      fkCategoria: String(data.selectedCategory),
    };

    console.log('\n' + '='.repeat(60));
    console.log('💾 [UPDATE TRANSACTION] Atualizando transação');
    console.log('='.repeat(60));
    console.log('🆔 ID:', transacaoId);
    console.log('📦 Payload:', JSON.stringify(transacaoAtualizada, null, 2));
    console.log('='.repeat(60) + '\n');

    const resultado = await transacaoService.atualizar(String(transacaoId), transacaoAtualizada);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ [SUCCESS] Transação atualizada com sucesso!');
    console.log('='.repeat(60));
    console.log('📥 Resposta:', JSON.stringify(resultado, null, 2));
    console.log('='.repeat(60) + '\n');

    return resultado;
  };

  /**
   * Deleta a transação
   */
  const deletarTransacao = async () => {
    if (!transacaoId) {
      throw new Error('ID da transação não definido');
    }

    console.log('\n' + '='.repeat(60));
    console.log('🗑️ [DELETE TRANSACTION] Deletando transação');
    console.log('='.repeat(60));
    console.log('🆔 ID:', transacaoId);
    console.log('='.repeat(60) + '\n');

    await transacaoService.deletar(String(transacaoId));
    
    console.log('✅ [SUCCESS] Transação deletada com sucesso!\n');
  };

  return {
    ...formState,
    loadingTransacao,
    transacaoOriginal,
    atualizarTransacao,
    deletarTransacao,
    carregarTransacao,
  };
};
