import { COLORS } from '../../../../styles/colors';

export const TIPOS_OBJETIVO = [
  { id: 'LIMITE_GASTO', label: 'Diminuir gasto' },
  { id: 'AUMENTO_RECEITA', label: 'Aumentar receita' },
];

export const PRIORIDADES = [
  { id: 'ALTA', label: 'Alta' },
  { id: 'MEDIA', label: 'Média' },
  { id: 'BAIXA', label: 'Baixa' },
];

export const PRIORIDADE_VISUAL = {
  ALTA: { label: 'Alta', color: COLORS.error, background: '#FFECEC' },
  MEDIA: { label: 'Média', color: COLORS.warning, background: '#FFF4E5' },
  BAIXA: { label: 'Baixa', color: COLORS.success, background: '#E9F8EF' },
};

export const TIPOS_CATEGORIA_OBJETIVOS = ['GASTO', 'RECEITA', 'GLOBAL'] as const;

export const STATUS_VISUAL = {
  'no caminho': { label: 'No caminho', color: COLORS.primary, background: '#E8F1FF' },
  'bom ritmo': { label: 'Bom ritmo', color: COLORS.success, background: '#E9F8EF' },
  'falta pouco': { label: 'Falta pouco', color: COLORS.warning, background: '#FFF4E5' },
  'meta batida': { label: 'Meta batida', color: COLORS.success, background: '#E9F8EF' },
  'tranquilo': { label: 'Tranquilo', color: COLORS.success, background: '#E9F8EF' },
  'atenção': { label: 'Atenção', color: COLORS.warning, background: '#FFF4E5' },
  'cuidado': { label: 'Cuidado', color: COLORS.warning, background: '#FFE8D6' },
  'acima do combinado': { label: 'Acima do combinado', color: COLORS.error, background: '#FFECEC' },
};

export const TIPO_VISUAL = {
  LIMITE_GASTO: { label: 'Limitar gasto', color: COLORS.error, background: '#FFECEC' },
  AUMENTO_RECEITA: { label: 'Aumentar receita', color: COLORS.success, background: '#E9F8EF' },
};

export const PRIORIDADE_LABELS = {
  ALTA: 'alta',
  MEDIA: 'média',
  BAIXA: 'baixa',
};

export const INSIGHTS_MOCK = [
  'Revise gastos em {categoria} no fim de semana para manter o ritmo.',
  'O objetivo de {categoria} esta bem encaminhado. Mantenha consistencia.',
  'Se reduzir pequenas despesas de {categoria}, voce ganha folga no limite.',
  'Acompanhe {categoria} duas vezes por semana para evitar desvios.',
  'Seu foco em {categoria} esta ajudando. Continue com o plano.',
  'Reforce as acoes que mais impactam {categoria} nos proximos dias.',
];
