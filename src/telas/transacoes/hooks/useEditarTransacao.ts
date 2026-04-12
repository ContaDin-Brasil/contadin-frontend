import { useState, useEffect } from 'react';
import { useFormularioTransacao } from './useFormularioTransacao';
import { transacaoService, instituicaoService } from '../../../api';
import { limparValorMonetario } from '../utils/formatacaoMoeda';

/**
 * Hook customizado para gerenciar a edição de uma transação existente
 * Reutiliza useFormularioTransacao mas inicializa com dados da transação
 */
export const useEditarTransacao = (transacaoId: string | null) => {
  const formState = useFormularioTransacao();
  const [loadingTransacao, setLoadingTransacao] = useState(true);
  const [transacaoOriginal, setTransacaoOriginal] = useState<any>(null);
  const [pendingFkInstituicao, setPendingFkInstituicao] = useState<string | null>(null);
  const [pendingFkCategoria, setPendingFkCategoria] = useState<string | null>(null);

  /**
   * Aplica a instituição pendente assim que a lista de instituições estiver disponível
   */
  useEffect(() => {
    if (!pendingFkInstituicao || formState.instituicoes.length === 0) return;

    const instituicao = formState.instituicoes.find(
      (inst: any) => String(inst.id) === pendingFkInstituicao
    );

    if (instituicao) {
      console.log('🏦 Instituição aplicada:', instituicao.nome);
      formState.handleSelectInstitution(instituicao);
      formState.setInstitutionType(
        instituicao.tipoInstituicao === 'VALE' ? 'vouchers' : 'banks'
      );
      setPendingFkInstituicao(null);
    } else {
      console.warn('⚠️ Instituição ainda não encontrada:', pendingFkInstituicao);
    }
  }, [pendingFkInstituicao, formState.instituicoes]);

  /**
   * Aplica a categoria pendente assim que a lista de categorias estiver disponível
   */
  useEffect(() => {
    if (!pendingFkCategoria || formState.categorias.length === 0) return;

    formState.setSelectedCategory(pendingFkCategoria);
    setPendingFkCategoria(null);
  }, [pendingFkCategoria, formState.categorias]);

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
    
    // Valor - formata para exibição com duas casas decimais
    const valorNumerico = parseFloat(transacao.valor);
    const valorFormatado = valorNumerico.toFixed(2).replace('.', ',');
    formState.setValor(valorFormatado);
    
    // Data - backend retorna no formato "dd/MM/yyyy HH:mm:ss", extrai apenas a parte da data
    const dataRaw = transacao.dataTransacao;
    if (dataRaw) {
      const datePart = dataRaw.includes(' ') ? dataRaw.split(' ')[0] : dataRaw.split('T')[0];
      // Se já é dd/MM/yyyy, usa direto. Se é yyyy-MM-dd, inverte
      const partes = datePart.split('/');
      const dataFormatada = partes.length === 3 && partes[0].length === 2
        ? datePart
        : partes.reverse().join('/');
      formState.handleDateChange(dataFormatada);
    }

    // Categoria — armazena o ID pendente para ser aplicado via useEffect quando as categorias carregarem
    if (transacao.fkCategoria) {
      setPendingFkCategoria(String(transacao.fkCategoria));
    }

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
        const fimRaw = transacao.fimRecorrencia;
        const fimPart = fimRaw.includes(' ') ? fimRaw.split(' ')[0] : fimRaw;
        const fimPartes = fimPart.split('/');
        const fimFormatado = fimPartes.length === 3 && fimPartes[0].length === 2
          ? fimPart
          : fimPartes.reverse().join('/');
        formState.handleRecurrenceEndDateChange(fimFormatado);
      }
    }

    // Instituição — armazena o ID pendente para ser aplicado via useEffect quando a lista carregar
    if (transacao.fkInstituicao) {
      setPendingFkInstituicao(String(transacao.fkInstituicao));
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
