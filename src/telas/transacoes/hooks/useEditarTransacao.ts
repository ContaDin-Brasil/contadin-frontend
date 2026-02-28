import { useState, useEffect } from 'react';
import { useFormularioTransacao } from './useFormularioTransacao';
import { transacaoService, instituicaoService } from '../../../api';
import { limparValorMonetario } from '../utils/formatacaoMoeda';

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
   */
  useEffect(() => {
    if (transacaoId) {
      carregarTransacao();
    }
  }, [transacaoId]);

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
      
      const transacao = await transacaoService.buscarPorId(transacaoId);
      
      console.log('📦 Dados recebidos:', JSON.stringify(transacao, null, 2));
      console.log('='.repeat(60) + '\n');
      
      setTransacaoOriginal(transacao);
      
      // Preenche o formulário com os dados da transação
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
    console.log('✏️ [FILL FORM] Preenchendo formulário com dados da transação');
    
    // Descrição e tipo
    formState.setDescricao(transacao.descricao);
    formState.setTipo(transacao.tipo);
    
    // Valor - formata para exibição
    const valorFormatado = transacao.valor.toString().replace('.', ',');
    formState.setValor(valorFormatado);
    
    // Data - converte de ISO para DD/MM/YYYY
    const dataTransacao = new Date(transacao.data_transacao);
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
    
    // Instituição - aguarda carregar as instituições
    if (transacao.fk_instituicao) {
      // Aguarda um momento para garantir que as instituições foram carregadas
      setTimeout(async () => {
        const instituicao = formState.instituicoes.find(
          (inst: any) => inst.id === transacao.fk_instituicao
        );
        
        if (instituicao) {
          console.log('🏦 Instituição encontrada:', instituicao.nome);
          formState.handleSelectInstitution(instituicao);
          
          // Define o tipo de instituição correto
          if (instituicao.tipoInstituicao === 'vale') {
            formState.setInstitutionType('vouchers');
          } else {
            formState.setInstitutionType('banks');
          }
        } else {
          console.warn('⚠️ Instituição não encontrada:', transacao.fk_instituicao);
        }
      }, 500);
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
