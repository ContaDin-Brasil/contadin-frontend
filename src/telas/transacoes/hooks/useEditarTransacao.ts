import { useState, useEffect } from 'react';
import { useFormularioTransacao } from './useFormularioTransacao';
import { transacaoService, instituicaoService } from '../../../api';
import { limparValorMonetario } from '../utils/formatacaoMoeda';
import { parseTransacaoDate } from '../utils/utilitariosTransacao';

/**
 * Hook customizado para gerenciar a edição de uma transação existente
 * Reutiliza useFormularioTransacao mas inicializa com dados da transação
 */
export const useEditarTransacao = (transacaoId: number | null) => {
  const formState = useFormularioTransacao();
  const [loadingTransacao, setLoadingTransacao] = useState(true);
  const [transacaoOriginal, setTransacaoOriginal] = useState<any>(null);

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
  const preencherFormulario = async (transacao: any) => {
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
    const valorNumerico = parseFloat(transacao.valor);
    const valorFormatado = valorNumerico.toFixed(2).replace('.', ',');
    formState.setValor(valorFormatado);
    
    // Data - converte de ISO para DD/MM/YYYY
    const dataTransacao = parseTransacaoDate(transacao.data_transacao);
    const dia = String(dataTransacao.getDate()).padStart(2, '0');
    const mes = String(dataTransacao.getMonth() + 1).padStart(2, '0');
    const ano = dataTransacao.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;
    formState.handleDateChange(dataFormatada);
    
    // Categoria
    if (transacao.fk_categoria) {
      formState.setSelectedCategory(transacao.fk_categoria);
    }
    
    // Parcelamento
    if (transacao.parcelado) {
      formState.setIsInstallment(true);
      const qtdParcelas = transacao.qtdParcelas || 2;
      
      // Verifica se a quantidade de parcelas está nas opções padrão (2-12)
      const opcoesParcelamento = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      if (opcoesParcelamento.includes(qtdParcelas)) {
        formState.setInstallmentCount(qtdParcelas);
      } else {
        // Se não está nas opções padrão, usa "Outro valor" (0)
        formState.setInstallmentCount(0);
        formState.setCustomInstallmentValue(qtdParcelas.toString());
      }
    }
    
    // Recorrência
    if (transacao.recorrencia) {
      formState.setIsRecurring(true);
      formState.setFrequency(transacao.recorrencia);
      
      // Data fim de recorrência
      if (transacao.fim_recorrencia) {
        formState.setHasRecurrenceEndDate(true);
        const fimRecorrencia = new Date(transacao.fim_recorrencia);
        const diaFim = String(fimRecorrencia.getDate()).padStart(2, '0');
        const mesFim = String(fimRecorrencia.getMonth() + 1).padStart(2, '0');
        const anoFim = fimRecorrencia.getFullYear();
        const dataFimFormatada = `${diaFim}/${mesFim}/${anoFim}`;
        formState.handleRecurrenceEndDateChange(dataFimFormatada);
      }
    }
    
    // Instituição - agora as instituições já estão carregadas no formState
    if (transacao.fk_instituicao) {
      console.log('🏦 [INSTITUTION] Buscando instituição com ID:', transacao.fk_instituicao);
      console.log('   Instituições disponíveis no formState:', formState.instituicoes.length);
      console.log('   IDs:', formState.instituicoes.map((i: any) => i.id).join(', '));
      
      const instituicao = formState.instituicoes.find(
        (inst: any) => inst.id === transacao.fk_instituicao
      );
      
      if (instituicao) {
        console.log('✅ [INSTITUTION] Instituição encontrada:', instituicao.nome);
        formState.handleSelectInstitution(instituicao);
        
        // Define o tipo de instituição correto
        if (instituicao.tipoInstituicao === 'vale') {
          formState.setInstitutionType('vouchers');
        } else {
          formState.setInstitutionType('banks');
        }
      } else {
        console.warn('⚠️ [INSTITUTION] Instituição não encontrada no array:', transacao.fk_instituicao);
        console.warn('   Instituições disponíveis:', formState.instituicoes.map((i: any) => `${i.id}:${i.nome}`).join(', '));
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

    // Converte data DD/MM/YYYY para ISO
    const [day, month, year] = data.date.split('/');
    const dataISO = new Date(`${year}-${month}-${day}`).toISOString();

    // Converte data fim de recorrência se houver
    let fimRecorrenciaISO = null;
    if (data.hasRecurrenceEndDate && data.recurrenceEndDate) {
      const [endDay, endMonth, endYear] = data.recurrenceEndDate.split('/');
      fimRecorrenciaISO = new Date(`${endYear}-${endMonth}-${endDay}`).toISOString();
    }

    // Prepara dados para envio
    const transacaoAtualizada = {
      id: transacaoId,
      descricao: data.descricao,
      valor: data.valor, // Valor já está como number do getFormData
      tipo: data.tipo,
      data_transacao: dataISO,
      parcelado: data.parcelado,
      qtdParcelas: data.qtdParcelas,
      recorrencia: data.isRecurring ? data.frequency : null,
      fim_recorrencia: fimRecorrenciaISO,
      fk_instituicao: data.selectedInstitution.id,
      fk_categoria: data.selectedCategory,
    };

    console.log('\n' + '='.repeat(60));
    console.log('💾 [UPDATE TRANSACTION] Atualizando transação');
    console.log('='.repeat(60));
    console.log('🆔 ID:', transacaoId);
    console.log('📦 Payload:', JSON.stringify(transacaoAtualizada, null, 2));
    console.log('='.repeat(60) + '\n');

    const resultado = await transacaoService.atualizar(transacaoId, transacaoAtualizada);
    
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

    await transacaoService.deletar(transacaoId);
    
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
