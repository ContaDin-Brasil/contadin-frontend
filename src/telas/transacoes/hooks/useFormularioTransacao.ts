import { useState } from 'react';
import { 
  TransactionType, 
  InstitutionType, 
  FrequencyType, 
  Institution,
  AISuggestion 
} from '../types/transacao.types';
import { DEFAULT_INSTITUTIONS } from '../constants/constantesTransacao';

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
  const [selectedCategory, setSelectedCategory] = useState(3); // ID da categoria Salário
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<FrequencyType>('MENSAL');
  const [institutionType, setInstitutionType] = useState<InstitutionType>('banks');
  const [selectedInstitutions, setSelectedInstitutions] = useState<Institution[]>(DEFAULT_INSTITUTIONS);

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
   * Adiciona uma instituição à lista de selecionadas
   */
  const handleSelectInstitution = (institution: Institution) => {
    const exists = selectedInstitutions.find(i => i.id === institution.id);
    if (!exists) {
      setSelectedInstitutions([...selectedInstitutions, institution]);
    }
  };

  /**
   * Adiciona uma instituição customizada
   */
  const handleAddCustomInstitution = (institution: Institution) => {
    setSelectedInstitutions([...selectedInstitutions, institution]);
  };

  /**
   * Aplica as sugestões da IA ao formulário
   */
  const applyAISuggestion = (suggestion: AISuggestion) => {
    setDescricao(suggestion.descricao);
    setValor(suggestion.valor);
    if (suggestion.data) {
      setDate(suggestion.data);
    }
    setTipo(suggestion.tipo);
    // selectedCategory agora precisa ser o ID, não string
    // Manter o valor atual ou buscar o ID correto da categoria
  };

  /**
   * Retorna os dados do formulário para salvar
   */
  const getFormData = () => ({
    descricao,
    valor: valor ? parseFloat(valor.replace(',', '.')) : 0,
    date,
    tipo,
    selectedCategory,
    isRecurring,
    frequency: isRecurring ? frequency : null,
    institutions: selectedInstitutions,
    institutionType
  });

  /**
   * Reseta o formulário
   */
  const resetForm = () => {
    setDescricao('');
    setValor('');
    setDate(getTodayDate());
    setTipo('RECEITA');
    setCategorySearch('');
    setSelectedCategory(3); // ID da categoria Salário
    setIsRecurring(false);
    setFrequency('MENSAL');
    setInstitutionType('banks');
    setSelectedInstitutions(DEFAULT_INSTITUTIONS);
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
    institutionType,
    selectedInstitutions,
    
    // Modificadores
    setDescricao,
    setValor,
    setTipo,
    setCategorySearch,
    setSelectedCategory,
    setIsRecurring,
    setFrequency,
    setInstitutionType,
    
    // Ações
    handleDateChange,
    handleSelectInstitution,
    handleAddCustomInstitution,
    applyAISuggestion,
    getFormData,
    resetForm,
  };
};
