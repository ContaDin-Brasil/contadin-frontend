import { useState, useEffect } from 'react';
import { 
  TransactionType, 
  InstitutionType, 
  FrequencyType, 
  Institution,
  AISuggestion 
} from '../types/transacao.types';
import { instituicaoService, categoriaService } from '../../../api';
import { formatarValorMonetario, limparValorMonetario, converterParaNumero } from '../utils/formatacaoMoeda';

/**
 * Obtém a data de hoje no formato DD/MM/YYYY
 */
const getTodayDate = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Hook customizado para gerenciar o estado do formulário de transação
 * Alinhado com o schema do DB (tabela: transacao)
 */
export const useFormularioTransacao = () => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [tipo, setTipo] = useState<TransactionType>('RECEITA');
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(1); // ID da primeira categoria
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<FrequencyType>('MENSAL');
  const [hasRecurrenceEndDate, setHasRecurrenceEndDate] = useState(false);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(getTodayDate());
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentCount, setInstallmentCount] = useState(2);
  const [customInstallmentCount, setCustomInstallmentCount] = useState('');
  const [institutionType, setInstitutionType] = useState<InstitutionType>('banks');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  
  // Estados para dados da API
  const [categorias, setCategorias] = useState<any[]>([]);
  const [instituicoes, setInstituicoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usuarioId = 1;

  /**
   * Carrega categorias e instituições ao montar
   */
  useEffect(() => {
    carregarDados();
  }, []);

  /**
   * Carrega dados da API
   */
  const carregarDados = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [categoriasData, instituicoesData] = await Promise.all([
        categoriaService.listarPorUsuario(usuarioId),
        instituicaoService.listarPorUsuario(usuarioId)
      ]);
      
      setCategorias(categoriasData);
      
      // Mapeia instituições para o formato esperado
      const instituicoesFormatadas = instituicoesData.map((inst: any) => ({
        id: inst.id,
        nome: inst.nome,
        cor: inst.cor,
        icone: inst.icone,
        tipoInstituicao: inst.tipoInstituicao
      }));
      
      setInstituicoes(instituicoesFormatadas);
      
      // Seleciona primeira instituição do tipo banco como padrão
      const primeiroBanco = instituicoesFormatadas.find((inst: any) => inst.tipoInstituicao === 'banco');
      if (primeiroBanco) {
        setSelectedInstitution(primeiroBanco);
      }
      
      // Define primeira categoria como padrão
      if (categoriasData.length > 0) {
        setSelectedCategory(categoriasData[0].id);
      }
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formata o valor monetário enquanto o usuário digita
   * Aplica máscara automática: 12345 -> "123,45"
   */
  const handleValorChange = (text: string) => {
    console.log('💵 [VALOR CHANGE] Input recebeu:', text);
    
    // Se o texto já está formatado corretamente (tem vírgula), apenas valida
    if (text.includes(',')) {
      // Verifica se é um formato válido (números, pontos e uma vírgula)
      const partes = text.split(',');
      if (partes.length === 2 && partes[1].length <= 2) {
        // Formato válido, usa diretamente
        console.log('💵 [VALOR CHANGE] Valor já formatado, usando direto:', text);
        setValor(text);
        return;
      }
    }
    
    // Caso contrário, aplica formatação normal
    const valorFormatado = formatarValorMonetario(text);
    console.log('💵 [VALOR CHANGE] Valor formatado:', valorFormatado);
    setValor(valorFormatado);
  };

  /**
   * Formata a data enquanto o usuário digita (DD/MM/YYYY)
   */
  const handleDateChange = (text: string) => {
    // Remove tudo que não é número
    const cleaned = text.replace(/\D/g, '');
    
    // Adiciona as barras automaticamente
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    }
    
    setDate(formatted);
  };

  /**
   * Retorna instituições filtradas pelo tipo selecionado
   */
  const getFilteredInstitutions = () => {
    return instituicoes.filter((inst: any) => {
      if (institutionType === 'banks') {
        return inst.tipoInstituicao === 'banco';
      } else {
        return inst.tipoInstituicao === 'vale';
      }
    });
  };

  /**
   * Seleciona uma instituição ou remove a seleção se null
   */
  const handleSelectInstitution = (institution: Institution | null) => {
    setSelectedInstitution(institution);
  };

  /**
   * Adiciona uma instituição customizada
   */
  const handleAddCustomInstitution = (institution: Institution) => {
    const novaInstituicao = {
      ...institution,
      tipoInstituicao: institutionType === 'banks' ? 'banco' : 'vale'
    };
    setInstituicoes([...instituicoes, novaInstituicao]);
    setSelectedInstitution(novaInstituicao);
  };

  /**
   * Formata a data fim de recorrência
   */
  const handleRecurrenceEndDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    }
    setRecurrenceEndDate(formatted);
  };

  /**
   * Valida se a data fim de recorrência é posterior à data da transação
   */
  const validateRecurrenceEndDate = (): string | null => {
    if (!hasRecurrenceEndDate || !isRecurring) {
      return null;
    }

    // Verifica se a data está completa
    if (recurrenceEndDate.length !== 10) {
      return 'Data incompleta';
    }

    // Verifica se a data da transação está completa
    if (date.length !== 10) {
      return 'Defina a data da transação primeiro';
    }

    // Converte as datas para comparação
    const [endDay, endMonth, endYear] = recurrenceEndDate.split('/').map(Number);
    const [startDay, startMonth, startYear] = date.split('/').map(Number);

    const endDate = new Date(endYear, endMonth - 1, endDay);
    const startDate = new Date(startYear, startMonth - 1, startDay);

    // Valida se a data é válida
    if (isNaN(endDate.getTime())) {
      return 'Data inválida';
    }

    // Verifica se a data fim é posterior à data inicial
    if (endDate <= startDate) {
      return 'Data limite deve ser posterior à data da transação';
    }

    return null;
  };

  /**
   * Ativa recorrência e desativa parcelamento
   */
  const handleToggleRecurring = (value: boolean) => {
    setIsRecurring(value);
    if (value) {
      setIsInstallment(false);
    }
  };

  /**
   * Ativa parcelamento e desativa recorrência
   */
  const handleToggleInstallment = (value: boolean) => {
    setIsInstallment(value);
    if (value) {
      setIsRecurring(false);
    }
  };

  /**
   * Aplica as sugestões da IA ao formulário
   */
  const applyAISuggestion = (suggestion: AISuggestion) => {
    setDescricao(suggestion.descricao);
    
    // A IA já retorna valores formatados (ex: "145,80" ou "5.000,00")
    // Apenas removemos espaços extras e setamos diretamente
    const valorFormatado = suggestion.valor.trim();
    setValor(valorFormatado);
    
    if (suggestion.data) {
      setDate(suggestion.data);
    }
    setTipo(suggestion.tipo);
    
    console.log('📝 [AI SUGGESTION] Aplicando sugestão:');
    console.log('   • Descrição:', suggestion.descricao);
    console.log('   • Valor original:', suggestion.valor);
    console.log('   • Valor aplicado:', valorFormatado);
  };

  /**
   * Retorna os dados do formulário para salvar
   */
  const getFormData = () => {
    const valorNumerico = converterParaNumero(valor);
    
    const formData = {
      descricao,
      valor: valorNumerico,
      date,
      tipo,
      selectedCategory,
      isRecurring,
      frequency: isRecurring ? frequency : null,
      hasRecurrenceEndDate,
      recurrenceEndDate: hasRecurrenceEndDate && isRecurring ? recurrenceEndDate : null,
      parcelado: isInstallment,
      qtdParcelas: isInstallment ? (customInstallmentCount ? parseInt(customInstallmentCount) : installmentCount) : 1,
      selectedInstitution,
      institutionType
    };
    
    console.log('📋 [FORM DATA] Dados do formulário:');
    console.log('   • Valor formatado:', valor);
    console.log('   • Valor numérico:', valorNumerico);
    console.log('   • Dados completos:', JSON.stringify(formData, null, 2));
    return formData;
  };

  /**
   * Reseta o formulário
   */
  const resetForm = () => {
    setDescricao('');
    setValor('');
    setDate(getTodayDate());
    setTipo('RECEITA');
    setCategorySearch('');
    if (categorias.length > 0) {
      setSelectedCategory(categorias[0].id);
    }
    setIsRecurring(false);
    setFrequency('MENSAL');
    setHasRecurrenceEndDate(false);
    setRecurrenceEndDate(getTodayDate());
    setIsInstallment(false);
    setInstallmentCount(2);
    setCustomInstallmentCount('');
    setInstitutionType('banks');
    const primeiroBanco = instituicoes.find((inst: any) => inst.tipoInstituicao === 'banco');
    if (primeiroBanco) {
      setSelectedInstitution(primeiroBanco);
    }
  };

  return {
    // Estados
    descricao,
    valor,
    date,
    tipo,
    categorySearch,
    selectedCategory,
    isRecurring,
    frequency,
    hasRecurrenceEndDate,
    recurrenceEndDate,
    isInstallment,
    installmentCount,
    customInstallmentCount,
    institutionType,
    selectedInstitution,
    categorias,
    instituicoes,
    loading,
    error,
    
    // Modificadores
    setDescricao,
    setValor,
    setTipo,
    setCategorySearch,
    setSelectedCategory,
    setIsRecurring,
    setFrequency,
    setHasRecurrenceEndDate,
    setIsInstallment,
    setInstallmentCount,
    setCustomInstallmentCount,
    setInstitutionType,
    
    // Ações
    handleValorChange,
    handleDateChange,
    handleRecurrenceEndDateChange,
    handleToggleRecurring,
    handleToggleInstallment,
    handleSelectInstitution,
    handleAddCustomInstitution,
    applyAISuggestion,
    getFormData,
    getFilteredInstitutions,
    resetForm,
    carregarDados,
    validateRecurrenceEndDate,
  };
};
