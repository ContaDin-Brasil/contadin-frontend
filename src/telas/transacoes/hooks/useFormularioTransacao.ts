import { useState, useEffect } from 'react';
import {
  TransactionType,
  InstitutionType,
  FrequencyType,
  Institution,
  Category,
  Transaction,
  AISuggestion
} from '../types/transacao.types';
import { instituicaoService, categoriaService, transacaoService } from '../../../api';
import type { InstituicaoApi, TransacaoApi } from '../../../api/types';
import { useAuth } from '../../../contexts/AuthContext';
import { formatarValorMonetario, limparValorMonetario, converterParaNumero } from '../utils/formatacaoMoeda';
import { extrairUsuarioId } from '../../../utils/normalizacao';

type InstituicaoComTipo = Institution & {
  tipoInstituicao: 'BANCO' | 'VALE';
};

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
  const { user } = useAuth();
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [tipo, setTipo] = useState<TransactionType>('RECEITA');
  const [categorySearch, setCategorySearch] = useState('');
  const [debouncedCategorySearch, setDebouncedCategorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<FrequencyType>('MENSAL');
  const [hasRecurrenceEndDate, setHasRecurrenceEndDate] = useState(false);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(getTodayDate());
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentCount, setInstallmentCount] = useState(2);
  const [customInstallmentValue, setCustomInstallmentValue] = useState('');
  const [institutionType, setInstitutionType] = useState<InstitutionType>('banks');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [modalCategoriaVisible, setModalCategoriaVisible] = useState(false);

  // Estados para dados da API
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [transacoes, setTransacoes] = useState<Transaction[]>([]);
  const [instituicoes, setInstituicoes] = useState<InstituicaoComTipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usuarioId = extrairUsuarioId(user);

  const carregarCategoriasParaTransacoes = async (
    usuarioIdAtual: string | number,
  ): Promise<Category[]> => {
    const service = categoriaService as typeof categoriaService & {
      listarParaTransacoes?: (id: string | number) => Promise<Category[]>;
    };

    if (typeof service.listarParaTransacoes === 'function') {
      return await service.listarParaTransacoes(usuarioIdAtual);
    }

    const resultados = await Promise.allSettled([
      categoriaService.listarPorUsuario(usuarioIdAtual, 'GASTO'),
      categoriaService.listarPorUsuario(usuarioIdAtual, 'RECEITA'),
      categoriaService.listarPorUsuario(usuarioIdAtual, 'GLOBAL'),
    ]);

    const mapa = new Map<string, Category>();

    resultados.forEach((resultado) => {
      if (resultado.status === 'fulfilled') {
        (resultado.value ?? []).forEach((categoria: Category) => {
          mapa.set(String(categoria.id), categoria);
        });
      }
    });

    return Array.from(mapa.values());
  };

  const carregarTransacoesPorInstituicoes = async (
    instituicoesUsuario: InstituicaoComTipo[],
  ): Promise<Transaction[]> => {
    if (!Array.isArray(instituicoesUsuario) || instituicoesUsuario.length === 0) {
      return [];
    }

    const resultados = await Promise.allSettled(
      instituicoesUsuario.map((instituicao) =>
        transacaoService.listar({ fkInstituicao: instituicao.id }),
      ),
    );

    const mapaTransacoes = new Map<string, Transaction>();

    resultados.forEach((resultado, index) => {
      if (resultado.status === 'fulfilled') {
        const instituicaoId = instituicoesUsuario[index]?.id;
        (resultado.value ?? []).forEach((transacao: TransacaoApi) => {
          const transacaoId = String(transacao.id ?? '');
          if (!transacaoId) return;

          const transacaoComInstituicao: Transaction = {
            ...transacao,
            fkInstituicao: transacao.fkInstituicao ?? instituicaoId ?? null,
          };

          mapaTransacoes.set(transacaoId, transacaoComInstituicao);
        });
      }
    });

    return Array.from(mapaTransacoes.values());
  };

  /**
   * Debounce para busca de categorias (500ms)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCategorySearch(categorySearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [categorySearch]);

  /**
   * Carrega categorias e instituições ao montar (ou quando o usuário mudar)
   */
  useEffect(() => {
    if (usuarioId) {
      carregarDados();
    }
  }, [usuarioId]);

  /**
   * Carrega dados da API.
   * Usa Promise.allSettled para que a falha de um serviço não bloqueie os demais.
   */
  const carregarDados = async () => {
    if (!usuarioId) return;

    setLoading(true);
    setError(null);

    let instituicoesFormatadas: InstituicaoComTipo[] = [];

    // Instituições — mapeia campo 'type' do backend para 'tipoInstituicao'
    try {
      const instituicoesData = await instituicaoService.listarPorUsuario(usuarioId);
      instituicoesFormatadas = instituicoesData.map((inst: InstituicaoApi) => ({
        id: inst.id,
        nome: inst.nome,
        cor: inst.cor,
        icone: inst.icone,
        tipoInstituicao: inst.type === 'VALE' ? 'VALE' : 'BANCO',
      }));
      setInstituicoes(instituicoesFormatadas);
      console.log('[useFormularioTransacao] ✅ Instituições carregadas:', instituicoesFormatadas.length);
    } catch (errorInstituicoes) {
      console.error('[useFormularioTransacao] Erro ao carregar instituições:', errorInstituicoes);
      setInstituicoes([]);
    }

    // Categorias — carrega SEMPRE, independentemente de haver instituições
    try {
      const categoriasData = await carregarCategoriasParaTransacoes(usuarioId);
      setCategorias(categoriasData ?? []);
      console.log('[useFormularioTransacao] ✅ Categorias carregadas:', categoriasData?.length || 0);
      if ((categoriasData?.length ?? 0) > 0 && selectedCategory === null) {
        setSelectedCategory(String(categoriasData[0].id));
      }
    } catch (errorCategorias) {
      console.error('[useFormularioTransacao] Erro ao carregar categorias:', errorCategorias);
      setCategorias([]);
    }

    // Transações (usadas apenas para calcular top-3 de categorias; falha não é crítica)
    if (instituicoesFormatadas.length > 0) {
      try {
        const transacoesDoUsuario = await carregarTransacoesPorInstituicoes(instituicoesFormatadas);
        setTransacoes(transacoesDoUsuario);
      } catch (errorTransacoes) {
        console.warn('[useFormularioTransacao] Não foi possível carregar transações para top-3 de categorias:', errorTransacoes);
      }
    }

    setLoading(false);
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
   * Garante que o valor sempre tenha 2 casas decimais quando o campo perde o foco
   */
  const handleValorBlur = () => {
    if (!valor) return;

    const valorNumerico = converterParaNumero(valor);
    const valorFormatado = valorNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    console.log('💵 [VALOR BLUR] Formatando para 2 casas decimais:', valorFormatado);
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
   * Manipula mudanças no campo customizado de parcelas
   * Permite apenas números
   */
  const handleCustomInstallmentChange = (text: string) => {
    // Remove tudo que não é número
    const cleaned = text.replace(/\D/g, '');

    // Limita a 3 dígitos (máximo 720)
    const limited = cleaned.slice(0, 3);

    setCustomInstallmentValue(limited);
  };

  /**
   * Retorna instituições filtradas pelo tipo selecionado
   */
  const getFilteredInstitutions = () => {
    return instituicoes.filter((inst) => {
      if (institutionType === 'banks') {
        return inst.tipoInstituicao === 'BANCO';
      } else {
        return inst.tipoInstituicao === 'VALE';
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
    const tipoInstituicao: InstituicaoComTipo['tipoInstituicao'] =
      institutionType === 'banks' ? 'BANCO' : 'VALE';

    const novaInstituicao: InstituicaoComTipo = {
      ...institution,
      tipoInstituicao,
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
   * Calcula o valor de cada parcela
   */
  const getInstallmentValue = (): number => {
    if (!isInstallment || !valor) {
      return 0;
    }

    const valorNumerico = converterParaNumero(valor);

    // Se for "Outro valor" (0), usa o customInstallmentValue
    const qtdParcelas = installmentCount === 0
      ? parseInt(customInstallmentValue) || 0
      : installmentCount;

    if (qtdParcelas < 2) {
      return valorNumerico;
    }

    return valorNumerico / qtdParcelas;
  };

  /**
   * Valida configurações de parcelamento
   */
  const validateInstallment = (): string | null => {
    if (!isInstallment) {
      return null;
    }

    // Se for "Outro valor" (0), valida o campo customizado
    if (installmentCount === 0) {
      if (!customInstallmentValue || customInstallmentValue.trim() === '') {
        return 'Digite a quantidade de parcelas';
      }

      const customValue = parseInt(customInstallmentValue);
      if (isNaN(customValue)) {
        return 'Quantidade de parcelas inválida';
      }

      if (customValue < 2) {
        return 'Parcelamento deve ter no mínimo 2 parcelas';
      }

      if (customValue > 720) {
        return 'Parcelamento não pode exceder 720 parcelas';
      }
    } else {
      // Valida número mínimo de parcelas
      if (installmentCount < 2) {
        return 'Parcelamento deve ter no mínimo 2 parcelas';
      }
    }

    // Valida valor total
    if (!valor || converterParaNumero(valor) <= 0) {
      return 'Defina o valor da transação primeiro';
    }

    // Valida valor por parcela
    const valorParcela = getInstallmentValue();
    if (valorParcela < 0.01) {
      return 'Valor da parcela muito baixo';
    }

    // Verifica se a data da transação está completa
    if (date.length !== 10) {
      return 'Defina a data da transação primeiro';
    }

    return null;
  };

  /**
   * Retorna mensagem de alerta se valor da parcela for muito baixo
   */
  const getInstallmentWarning = (): string | null => {
    if (!isInstallment || !valor) {
      return null;
    }

    const valorParcela = getInstallmentValue();
    if (valorParcela > 0 && valorParcela < 1.00) {
      return `Parcelas de R$ ${valorParcela.toFixed(2)} - valor muito baixo`;
    }

    return null;
  };

  /**
   * Calcula a data da última parcela baseado na data da transação
   */
  const getLastInstallmentDate = (): string | null => {
    if (!isInstallment || date.length !== 10) {
      return null;
    }

    // Se for "Outro valor" (0), usa o customInstallmentValue
    const qtdParcelas = installmentCount === 0
      ? parseInt(customInstallmentValue) || 0
      : installmentCount;

    if (qtdParcelas < 2) {
      return null;
    }

    const [day, month, year] = date.split('/').map(Number);
    const firstDate = new Date(year, month - 1, day);

    // Adiciona (qtdParcelas - 1) meses à data da transação (primeira parcela)
    const lastDate = new Date(firstDate);
    lastDate.setMonth(lastDate.getMonth() + (qtdParcelas - 1));

    const lastDay = String(lastDate.getDate()).padStart(2, '0');
    const lastMonth = String(lastDate.getMonth() + 1).padStart(2, '0');
    const lastYear = lastDate.getFullYear();

    return `${lastDay}/${lastMonth}/${lastYear}`;
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
   * Aplica as sugestões da IA ao formulário, incluindo instituição
   * @param suggestion - Dados da transaction sugeridos pela IA
   * @param instituicaoSugerida - Instituição sugerida (com filtro para evitar Mercado Pago)
   * @param categoriaSugerida - Categoria sugerida
   */
  const applyAISuggestion = (
    suggestion: AISuggestion,
    instituicaoSugerida?: Institution | null,
    categoriaSugerida?: Category | null
  ) => {
    setDescricao(suggestion.descricao);

    // A IA já retorna valores formatados (ex: "145,80" ou "5.000,00")
    // Apenas removemos espaços extras e setamos diretamente
    const valorFormatado = suggestion.valor.trim();
    setValor(valorFormatado);

    if (suggestion.data) {
      setDate(suggestion.data);
    }
    setTipo(suggestion.tipo);

    // Aplica instituição sugerida (com validação contra Mercado Pago)
    if (instituicaoSugerida && instituicaoSugerida.id !== 14) {
      setSelectedInstitution(instituicaoSugerida);
      console.log('🏦 [AI SUGGESTION] Instituição aplicada:', instituicaoSugerida.nome);
    } else if (instituicaoSugerida && instituicaoSugerida.id === 14) {
      // Bloqueia Mercado Pago - deixa nula para usuário selecionar
      setSelectedInstitution(null);
      console.log('⚠️ [AI SUGGESTION] Mercado Pago (id 14) foi bloqueado, selecione manualmente');
    }

    // Aplica categoria sugerida (se houver e for válida)
    if (categoriaSugerida) {
      setSelectedCategory(String(categoriaSugerida.id));
      console.log('📂 [AI SUGGESTION] Categoria aplicada:', categoriaSugerida);
    }

    console.log('📝 [AI SUGGESTION] Aplicando sugestão:');
    console.log('   • Descrição:', suggestion.descricao);
    console.log('   • Valor original:', suggestion.valor);
    console.log('   • Valor aplicado:', valorFormatado);
    console.log('   • Tipo:', suggestion.tipo);
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
      qtdParcelas: isInstallment
        ? (installmentCount === 0 ? parseInt(customInstallmentValue) || 2 : installmentCount)
        : 1,
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
    setSelectedCategory(categorias.length > 0 ? String(categorias[0].id) : null);
    setIsRecurring(false);
    setFrequency('MENSAL');
    setHasRecurrenceEndDate(false);
    setRecurrenceEndDate(getTodayDate());
    setIsInstallment(false);
    setInstallmentCount(2);
    setCustomInstallmentValue('');
    setInstitutionType('banks');
    setSelectedInstitution(null);
  };

  /**
   * Calcula as 3 categorias mais usadas baseado nas transações
   */
  const getTop3Categorias = (): Category[] => {
    if (transacoes.length === 0) {
      // Se não houver transações, retorna as 3 primeiras categorias filtradas por tipo
      return getCategoriasFiltradasPorTipo().slice(0, 3);
    }

    // Conta frequência de uso de cada categoria
    const frequencia: Record<string, number> = {};

    transacoes.forEach((transacao) => {
      const catId = transacao.fkCategoria;
      if (catId) {
        const key = String(catId);
        frequencia[key] = (frequencia[key] || 0) + 1;
      }
    });

    // Ordena categorias por frequência e pega as top 3
    const categoriasOrdenadas = categorias
      .filter(cat => podeUsarPara(cat, tipo))
      .sort((a, b) => {
        const freqA = frequencia[String(a.id)] || 0;
        const freqB = frequencia[String(b.id)] || 0;
        return freqB - freqA;
      })
      .slice(0, 3);

    return categoriasOrdenadas;
  };

  /**
   * Filtra categorias pelo tipo de transação atual
   */
  const getCategoriasFiltradasPorTipo = (): Category[] => {
    return categorias.filter(cat => podeUsarPara(cat, tipo));
  };

  /**
   * Retorna categorias filtradas para exibição
   * - Retorna todas as categorias filtradas pelo tipo
   * - Se houver busca (após debounce): filtra também pela busca
   */
  const getCategoriasExibidas = (): Category[] => {
    const categoriasFiltradas = getCategoriasFiltradasPorTipo();

    // Se não houver busca, mostra todas as categorias
    if (!debouncedCategorySearch.trim()) {
      return categoriasFiltradas;
    }

    // Com busca, filtra pelo nome
    const searchLower = debouncedCategorySearch.toLowerCase().trim();
    return categoriasFiltradas.filter(cat =>
      cat.nome.toLowerCase().includes(searchLower)
    );
  };

  /**
   * Função auxiliar que verifica se categoria pode ser usada para o tipo
   */
  const podeUsarPara = (categoria: Category, tipoTransacao: TransactionType): boolean => {
    return categoria.tipo === 'GLOBAL' || categoria.tipo === tipoTransacao;
  };

  /**
   * Valida os 5 campos obrigatórios ao tentar salvar
   * Retorna objeto com validação e lista de erros
   */
  const validateOnSubmit = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    // Validar Descrição
    if (!descricao || descricao.trim().length === 0) {
      errors.descricao = 'Descrição obrigatória';
    }

    // Validar Valor
    const valorNumerico = converterParaNumero(valor);
    if (!valor || valorNumerico <= 0) {
      errors.valor = 'Valor deve ser maior que 0';
    }

    // Validar Instituição
    if (!selectedInstitution) {
      errors.instituicao = 'Selecione uma instituição';
    }

    const isValid = Object.keys(errors).length === 0;
    return { isValid, errors };
  };

  /**
   * Limpa os erros de validação
   */
  const clearValidationErrors = () => {
    // Função de limpeza - usada após sucesso ou quando usuário corrige os campos
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
    customInstallmentValue,
    institutionType,
    selectedInstitution,
    categorias,
    instituicoes,
    loading,
    error,
    modalCategoriaVisible,

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
    setCustomInstallmentValue,
    setInstitutionType,
    setModalCategoriaVisible,

    // Ações
    handleValorChange,
    handleValorBlur,
    handleDateChange,
    handleCustomInstallmentChange,
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
    validateInstallment,
    validateOnSubmit,
    clearValidationErrors,
    getInstallmentValue,
    getInstallmentWarning,
    getLastInstallmentDate,
    getCategoriasExibidas,
    getTop3Categorias,
  };
};
