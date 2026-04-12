import {
  AISuggestion,
  TransactionType,
} from '../types/transacao.types';
import type {
  OCRResponse200,
} from '../../../api/types';

/**
 * Resultado do mapeamento OCR com contexo adicional
 */
export interface MappedOCRResult {
  aiSuggestion: AISuggestion;
  fkInstituicao?: number;
  fkCategoria?: number;
  idInstituicaoExistente?: number;
}

/**
 * Converte ISO date (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss) para DD/MM/YYYY
 */
const formatISODateToBR = (isoDate: string): string => {
  try {
    // Extrai apenas a parte da data (YYYY-MM-DD)
    const datePart = isoDate.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.warn('❌ Erro ao formatar data OCR:', isoDate, error);
    // Fallback: retorna data de hoje
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const monthNum = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${monthNum}/${year}`;
  }
};

/**
 * Normaliza valor numérico para formato de exibição BR (com vírgula)
 *
 * @param valor - Valor como número ou string
 * @returns Valor formatado (ex: "145,80")
 *
 * @example
 * formatarValor(145.80) → "145,80"
 * formatarValor("145.80") → "145,80"
 * formatarValor(1000) → "1.000,00"
 */
const formatarValor = (valor: number | string): string => {
  try {
    const numValue = typeof valor === 'string' ? parseFloat(valor) : valor;

    if (isNaN(numValue)) {
      console.warn('❌ Valor inválido para formatação:', valor);
      return '0,00';
    }

    // Formata com separador de milhar (.) e decimal (,)
    return numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.warn('❌ Erro ao formatar valor:', valor, error);
    return '0,00';
  }
};

/**
 * Valida e normaliza o tipo de transação
 *
 * @param tipo - Tipo vindo do OCR (pode ser GASTO, RECEITA, Expense, Income, etc)
 * @returns Tipo normalizado (GASTO | RECEITA)
 */
const normalizarTipo = (tipo: string): TransactionType => {
  const tipoUpper = tipo.toUpperCase().trim();

  if (
    tipoUpper === 'GASTO' ||
    tipoUpper === 'EXPENSE' ||
    tipoUpper === 'SAÍDA'
  ) {
    return 'GASTO';
  }

  if (
    tipoUpper === 'RECEITA' ||
    tipoUpper === 'INCOME' ||
    tipoUpper === 'ENTRADA'
  ) {
    return 'RECEITA';
  }

  console.warn('⚠️ Tipo de transação desconhecido:', tipo, '→ usando GASTO como padrão');
  return 'GASTO';
};

/**
 * Mapeia resposta do OCR para o formato AISuggestion
 *
 * Converte:
 * - valor: número → string formatada com vírgula (BR)
 * - data_transacao: ISO string → DD/MM/YYYY
 * - tipo: qualquer variação (GASTO/EXPENSE/etc) → GASTO|RECEITA
 * - Preserva: instituição, categoria, e IDs de referência
 *
 * @param ocrResponse - Resposta do endpoint OCR (localhost:8000/ai/scan)
 * @returns MappedOCRResult com AISuggestion e metadados
 *
 * @example
 * const ocrResponse = {
 *   transacao: {
 *     valor: 145.80,
 *     tipo: 'GASTO',
 *     descricao: 'Compra no Extra',
 *     data_transacao: '2024-04-10',
 *     fk_instituicao: 1,
 *     fk_categoria: 5,
 *     parcelado: false,
 *     recorrencia: 'MENSAL'
 *   },
 *   instituicao: {
 *     nome: 'Nubank',
 *     tipo: 'banco',
 *     icone: 'nubank',
 *     cor: '#820ad1',
 *     id_existente: 1
 *   }
 * };
 *
 * const result = mapOCRToAISuggestion(ocrResponse);
 * // → {
 * //   aiSuggestion: {
 * //     descricao: 'Compra no Extra',
 * //     valor: '145,80',
 * //     tipo: 'GASTO',
 * //     categoria: 'Alimentação',
 * //     instituicao: 'Nubank',
 * //     data: '10/04/2024'
 * //   },
 * //   fkInstituicao: 1,
 * //   fkCategoria: 5,
 * //   idInstituicaoExistente: 1
 * // }
 */
export const mapOCRToAISuggestion = (
  ocrResponse: OCRResponse200
): MappedOCRResult => {
  const { transacao, instituicao } = ocrResponse;

  try {
    // Valida dados essenciais
    if (!transacao) {
      throw new Error('Resposta OCR sem dados de transação');
    }

    const aiSuggestion: AISuggestion = {
      descricao: transacao.descricao || 'Transação',
      valor: formatarValor(transacao.valor),
      tipo: normalizarTipo(transacao.tipo),
      categoria: transacao.categoria || 'Sem categoria',
      instituicao: instituicao?.nome || transacao.instituicao || 'Sem instituição',
      data: formatISODateToBR(transacao.data_transacao),
    };

    const result: MappedOCRResult = {
      aiSuggestion,
      fkInstituicao: transacao.fk_instituicao,
      fkCategoria: transacao.fk_categoria,
      idInstituicaoExistente: instituicao?.id_existente,
    };

    console.log('✅ Mapeamento OCR → AISuggestion bem-sucedido', result);
    return result;
  } catch (error) {
    console.error('❌ Erro ao mapear OCR para AISuggestion:', error);

    // Retorna sugestão vazia (fallback)
    const fallback: MappedOCRResult = {
      aiSuggestion: {
        descricao: 'Transação',
        valor: '0,00',
        tipo: 'GASTO',
        categoria: 'Sem categoria',
        instituicao: 'Sem instituição',
        data: (() => {
          const today = new Date();
          const day = String(today.getDate()).padStart(2, '0');
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const year = today.getFullYear();
          return `${day}/${month}/${year}`;
        })(),
      },
    };

    return fallback;
  }
};

export default mapOCRToAISuggestion;
