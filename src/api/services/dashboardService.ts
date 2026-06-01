import api from '../config';
import type {
  CategoriaApi,
  DadosDashboardApi,
  DadosPrevisaoSaldoApi,
  DashReceitaGastoResponse,
  GastoCategoriaApi,
  InstituicaoApi,
  ResumoFinanceiroApi,
  SaldoInstituicaoApi,
  TransacaoApi,
} from '../types';
import type { SaldoDiario } from '../../telas/dashboard/types/dashboard.types';

type ProjecaoFutura = {
  data: Date;
  delta: number;
};

/**
 * Busca indicadores de gastos e receitas por período
 * Utiliza o endpoint GET /dashboard/indicadores-transacoes do backend
 * 
 * @param usuarioId - UUID do usuário
 * @param tipo - Tipo de transação ('GASTO' ou 'RECEITA')
 * @param periodo - Período no formato YearMonth (ex: "2026-05" para Maio/2026)
 * @returns Dados agregados de gastos/receitas do período
 * 
 * @example
 * const dados = await buscarIndicadoresTransacoes(
 *   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 *   'GASTO',
 *   '2026-05'
 * );
 * // Retorna: { mes: 5, tipo: 'GASTO', valorTotal: 350 }
 */
export const buscarIndicadoresTransacoes = async (
  usuarioId: string,
  tipo: 'GASTO' | 'RECEITA',
  periodo?: string, // Formato: "YYYY-MM" (ex: "2026-05")
): Promise<DashReceitaGastoResponse> => {
  try {
    // Se não informar período, usa o mês atual
    const periodoFinal = periodo || (() => {
      const dataAtual = new Date();
      const ano = dataAtual.getFullYear();
      const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
      return `${ano}-${mes}`;
    })();

    const urlFinal = `/dashboard/indicadores-transacoes?periodo=${periodoFinal}&tipo=${tipo}&usuarioId=${usuarioId}`;
    console.log('[API] Chamando endpoint:', urlFinal);
    console.log('[API] usuarioId tipo:', typeof usuarioId, '| valor:', usuarioId);

    const response = await api.get<DashReceitaGastoResponse>(urlFinal);

    console.log('[API] Resposta recebida:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Erro ao buscar indicadores de transações:', error);
    if (error instanceof Error) {
      console.error('[API] Mensagem:', error.message);
    }
    throw error;
  }
};

/**
 * Busca resumo financeiro utilizando os novos endpoints de indicadores
 * Realiza duas chamadas paralelas: uma para GASTO e outra para RECEITA
 * 
 * @param usuarioId - Identificador do usuário
 * @returns Resumo com saldo total, receitas e gastos do mês atual
 */
export const buscarResumoFinanceiroComIndicadores = async (
  usuarioId: string,
): Promise<ResumoFinanceiroApi> => {
  try {
    // Buscar gastos e receitas em paralelo
    const [respostaGastos, respostaReceitas] = await Promise.all([
      buscarIndicadoresTransacoes(usuarioId, 'GASTO'),
      buscarIndicadoresTransacoes(usuarioId, 'RECEITA'),
    ]);

    const gastoTotal = respostaGastos.valorTotal || 0;
    const receitaTotal = respostaReceitas.valorTotal || 0;
    const saldoTotal = receitaTotal - gastoTotal;

    console.log('[API] Construindo resumo financeiro:');
    console.log('[API] - Gasto total:', gastoTotal);
    console.log('[API] - Receita total:', receitaTotal);
    console.log('[API] - Saldo total:', saldoTotal);

    // Formatar mês
    const NOMES_MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] as const;
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth();
    const anoAtual = dataAtual.getFullYear();
    const nomeMes = NOMES_MESES[mesAtual];

    const resumoFinal = {
      saldoTotal,
      receitaTotal,
      gastoTotal,
      mesAtual: `${nomeMes}/${anoAtual}`,
    };
    
    console.log('[API] ✅ Resumo financeiro final:', resumoFinal);
    return resumoFinal;
  } catch (error) {
    console.error('[Dashboard] Erro ao buscar resumo financeiro com indicadores:', error);
    throw error;
  }
};

/**
 * Verifica se o usuário já possui transações cadastradas em qualquer período.
 * A dashboard usa essa informação para não cair no empty state apenas porque
 * o mês atual ainda não tem movimento.
 */
export const usuarioPossuiTransacoes = async (
  usuarioId: string | number,
): Promise<boolean> => {
  try {
    const [responseTransacoes, responseInstituicoes] = await Promise.all([
      api.get<TransacaoApi[]>('/transacao'),
      api.get<InstituicaoApi[]>(`/instituicao?fk_usuario=${usuarioId}`),
    ]);

    const todasTransacoes = Array.isArray(responseTransacoes.data) ? responseTransacoes.data : [];
    const instituicoesUsuario = Array.isArray(responseInstituicoes.data) ? responseInstituicoes.data : [];
    const idsInstituicoes = instituicoesUsuario.map((instituicao) => instituicao.id);

    const transacoesUsuario = todasTransacoes.filter((transacao) =>
      transacao.fkInstituicao !== null &&
      transacao.fkInstituicao !== undefined &&
      idsInstituicoes.includes(transacao.fkInstituicao),
    );

    return transacoesUsuario.length > 0;
  } catch (error) {
    console.error('[Dashboard] Erro ao verificar transações do usuário:', error);
    throw error;
  }
};

/**
 * Busca gastos agrupados por categoria do endpoint real
 * GET /categorias/gastos?fkUsuario=UUID&mes=M&ano=YYYY
 * 
 * @param usuarioId - UUID do usuário
 * @param mes - Mês (1-12)
 * @param ano - Ano
 * @returns Array de categorias com gastos totais
 */
export const buscarGastosPorCategoriaEndpoint = async (
  usuarioId: string,
  mes?: number,
  ano?: number,
): Promise<GastoCategoriaApi[]> => {
  try {
    // Se não informar mês/ano, usa o atual
    const dataAtual = new Date();
    const mesParam = mes ?? (dataAtual.getMonth() + 1);
    const anoParam = ano ?? dataAtual.getFullYear();

    const url = `/categorias/gastos?fkUsuario=${usuarioId}&mes=${mesParam}&ano=${anoParam}`;
    console.log('[API] Chamando endpoint de gastos por categoria:', url);

    const response = await api.get<GastoCategoriaApi[]>(url);

    console.log('[API] ✅ Gastos por categoria recebidos (RAW):', response.data);
    console.log('[API] Tipo de resposta:', typeof response.data);
    console.log('[API] É array?:', Array.isArray(response.data));
    
    // Mapear resposta para garantir estrutura correta
    if (!Array.isArray(response.data)) {
      console.error('[API] ❌ Resposta não é um array:', response.data);
      return [];
    }

    const gastosMapeados = response.data.map((item: any) => ({
      id: item.id || item.categoriaId || item.fkCategoria || 0,
      nome: item.nome || item.categoriaNome || 'Sem categoria',
      icone: item.icone || item.icon || item.categoriaMcone || 'category',
      cor: item.cor || item.categoriaCor || '#999999',
      valor: Number(item.valor || item.valorTotal || item.total || 0),
      porcentagem: Number(item.porcentagem || item.percentual || 0),
    }));

    console.log('[API] ✅ Gastos por categoria MAPEADOS:', gastosMapeados);
    return gastosMapeados;
  } catch (error) {
    console.error('[API] Erro ao buscar gastos por categoria:', error);
    if (error instanceof Error) {
      console.error('[API] Mensagem:', error.message);
      if ((error as any).response) {
        console.error('[API] Status HTTP:', (error as any).response.status);
        console.error('[API] Response data:', (error as any).response.data);
      }
    }
    throw error;
  }
};

/**
 * Busca o resumo financeiro do usuário
 * Calcula saldo total, receitas e gastos do mês atual
 */
export const buscarResumoFinanceiro = async (usuarioId: number): Promise<ResumoFinanceiroApi> => {
  try {
    // ─────────────────────────────────────────────────────────────────
    // TODO: substituir pelo endpoint dedicado quando o backend estiver pronto
    //
    // REQUEST:
    //   GET /dashboard/resumo?usuarioId=1
    //   Headers: { Authorization: 'Bearer <token>' }
    //
    // RESPONSE esperado (o backend já entrega agregado, sem lógica no front):
    //   {
    //     "saldoTotal":   5230.50,
    //     "receitaTotal": 14500.00,
    //     "gastoTotal":   9269.50,
    //     "mesAtual":     "Fev/2026"
    //   }
    //
    // Como a função ficará depois da migração (todo o bloco abaixo some):
    //
    //   export const buscarResumoFinanceiro = async (usuarioId) => {
    //     try {
    //       const response = await api.get(`/dashboard/resumo?usuarioId=${usuarioId}`);
    //       return {
    //         ...response.data,
    //         mesAtual: formatarMesAno(response.data.mesAtual),
    //       };
    //     } catch (error) {
    //       console.error('Erro ao buscar resumo financeiro:', error);
    //       throw error;
    //     }
    //   };
    // ─────────────────────────────────────────────────────────────────

    // Buscar todas as transações e instituições
    const [responseTransacoes, responseInstituicoes] = await Promise.all([
      api.get<TransacaoApi[]>('/transacao'),
      api.get<InstituicaoApi[]>(`/instituicoes?fkUsuario=${usuarioId}`),
    ]);
    
    const todasTransacoes = responseTransacoes.data;
    const instituicoesUsuario = responseInstituicoes.data;
    const idsInstituicoes = instituicoesUsuario.map((i) => i.id);
    
    // Filtrar apenas transações das instituições do usuário
    const transacoesUsuario = todasTransacoes.filter((t) =>
      idsInstituicoes.includes(t.fkInstituicao)
    );

    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth();
    const anoAtual = dataAtual.getFullYear();

    // Filtrar transações do mês atual
    //(fuso UTC-3 Brasil)
    const transacoesMesAtual = transacoesUsuario.filter((t) => {
      const [ano, mes] = t.dataTransacao.split('T')[0].split('-').map(Number);
      return (mes - 1) === mesAtual && ano === anoAtual;
    });

    // Calcular totais
    const receitaTotal = transacoesMesAtual
      .filter((t) => t.tipo === 'RECEITA')
      .reduce((acc, t) => acc + t.valor, 0);

    const gastoTotal = transacoesMesAtual
      .filter((t) => t.tipo === 'GASTO')
      .reduce((acc, t) => acc + t.valor, 0);

    const saldoTotal = receitaTotal - gastoTotal;

    const NOMES_MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] as const;
    const nomeMes = NOMES_MESES[mesAtual];

    return {
      saldoTotal,
      receitaTotal,
      gastoTotal,
      mesAtual: `${nomeMes}/${anoAtual}`,
    };
  } catch (error) {
    console.error('Erro ao buscar resumo financeiro:', error);
    throw error;
  }
};

/**
 * Busca gastos agrupados por categoria
 * Retorna as top categorias com maior gasto
 */
export const buscarGastosPorCategoria = async (
  usuarioId: number,
  limite = 5,
): Promise<GastoCategoriaApi[]> => {
  try {
    // ─────────────────────────────────────────────────────────────────
    // TODO: substituir pelo endpoint dedicado quando o backend estiver pronto
    //
    // REQUEST:
    //   GET /dashboard/gastos-por-categoria?usuarioId=1&limite=3
    //   Headers: { Authorization: 'Bearer <token>' }
    //
    // RESPONSE esperado (GROUP BY categoria feito no banco):
    //   [
    //     { "id": 3,  "nome": "Moradia",      "icone": "home",       "cor": "#95E1D3", "valor": 3192.90, "porcentagem": 34 },
    //     { "id": 1,  "nome": "Alimentação",   "icone": "restaurant", "cor": "#FF6B6B", "valor": 2157.00, "porcentagem": 23 },
    //     { "id": 8,  "nome": "Vestuário",     "icone": "shopping-bag","cor": "#FF9800", "valor": 655.00,  "porcentagem":  7 }
    //   ]
    //
    // Como a função ficará depois da migração:
    //
    //   export const buscarGastosPorCategoria = async (usuarioId, limite = 5) => {
    //     try {
    //       const response = await api.get(`/dashboard/gastos-por-categoria?usuarioId=${usuarioId}&limite=${limite}`);
    //       return response.data;
    //     } catch (error) {
    //       console.error('Erro ao buscar gastos por categoria:', error);
    //       throw error;
    //     }
    //   };
    // ─────────────────────────────────────────────────────────────────

    // Buscar transações, categorias e instituições
    const [responseTransacoes, responseCategorias, responseInstituicoes] = await Promise.all([
      api.get<TransacaoApi[]>('/transacao'),
      api.get<CategoriaApi[]>('/categorias'),
      api.get<InstituicaoApi[]>(`/instituicoes?fkUsuario=${usuarioId}`),
    ]);
    
    const todasTransacoes = responseTransacoes.data;
    const categorias = responseCategorias.data.filter(
      (c) => c.fk_usuario === null || c.fk_usuario === usuarioId,
    );
    const instituicoesUsuario = responseInstituicoes.data;
    const idsInstituicoes = instituicoesUsuario.map((i) => i.id);
    
    const transacoesUsuario = todasTransacoes.filter((t) =>
      idsInstituicoes.includes(t.fkInstituicao) && t.tipo === 'GASTO'
    );

    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth();
    const anoAtual = dataAtual.getFullYear();

    // Filtrar transações do mês atual
    const transacoesMesAtual = transacoesUsuario.filter((t) => {
      const dataTransacao = new Date(t.dataTransacao);
      return dataTransacao.getMonth() === mesAtual && 
             dataTransacao.getFullYear() === anoAtual;
    });

    // Agrupar por categoria
    const gastosPorCategoria: Record<number, number> = {};
    transacoesMesAtual.forEach((t) => {
      const categoriaId = t.fkCategoria;
      gastosPorCategoria[categoriaId] = (gastosPorCategoria[categoriaId] || 0) + t.valor;
    });

    // Calcular total de gastos
    const totalGastos = Object.values(gastosPorCategoria).reduce((acc, val) => acc + val, 0);

    // Montar array com informações das categorias
    const gastosComInfo: GastoCategoriaApi[] = Object.entries(gastosPorCategoria).map(([categoriaId, valor]) => {
      const categoria = categorias.find((c) => c.id === parseInt(categoriaId, 10));
      return {
        id: parseInt(categoriaId, 10),
        nome: categoria?.nome || 'Sem categoria',
        icone: categoria?.icone || 'category',
        cor: categoria?.cor || '#999999',
        valor,
        porcentagem: totalGastos > 0 ? Math.round((valor / totalGastos) * 100) : 0,
      };
    });

    // Ordenar por valor decrescente e limitar
    gastosComInfo.sort((a, b) => b.valor - a.valor);
    return gastosComInfo.slice(0, limite);
  } catch (error) {
    console.error('Erro ao buscar gastos por categoria:', error);
    throw error;
  }
};

/**
 * Busca saldo agrupado por instituição
 * Retorna as top instituições com maior saldo
 */
export const buscarSaldosPorInstituicao = async (
  usuarioId: number,
  limite = 5,
): Promise<SaldoInstituicaoApi[]> => {
  try {
    // ─────────────────────────────────────────────────────────────────
    // TODO: substituir pelo endpoint dedicado quando o backend estiver pronto
    //
    // REQUEST:
    //   GET /dashboard/saldos-por-instituicao?usuarioId=1
    //   Headers: { Authorization: 'Bearer <token>' }
    //
    // RESPONSE esperado (saldo acumulado por instituição calculado no banco):
    //   [
    //     { "id": 26, "nome": "Nubank",      "icone": "Nu", "cor": "#820AD1", "tipo": "banco", "valor": 3200.00, "porcentagem": 61 },
    //     { "id": 27, "nome": "Inter",       "icone": "In", "cor": "#FF7A00", "tipo": "banco", "valor": 1450.50, "porcentagem": 28 },
    //     { "id": 9,  "nome": "Alelo",       "icone": "VA", "cor": "#FF9800", "tipo": "vale",  "valor":  580.00, "porcentagem": 11 }
    //   ]
    //
    // Como a função ficará depois da migração:
    //
    //   export const buscarSaldosPorInstituicao = async (usuarioId, limite = 5) => {
    //     try {
    //       const response = await api.get(`/dashboard/saldos-por-instituicao?usuarioId=${usuarioId}`);
    //       return response.data;
    //     } catch (error) {
    //       console.error('Erro ao buscar saldos por instituição:', error);
    //       throw error;
    //     }
    //   };
    // ─────────────────────────────────────────────────────────────────

    // Buscar instituições e transações
    const [responseInstituicoes, responseTransacoes] = await Promise.all([
      api.get<InstituicaoApi[]>(`/instituicoes?fkUsuario=${usuarioId}`),
      api.get<TransacaoApi[]>('/transacao'),
    ]);
    
    const instituicoes = responseInstituicoes.data;
    const todasTransacoes = responseTransacoes.data;

    // Calcular saldo por instituição
    const saldosPorInstituicao: SaldoInstituicaoApi[] = instituicoes.map((inst) => {
      const transacoesInst = todasTransacoes.filter((t) => t.fkInstituicao === inst.id);
      
      const receitas = transacoesInst
        .filter((t) => t.tipo === 'RECEITA')
        .reduce((acc, t) => acc + t.valor, 0);
      
      const gastos = transacoesInst
        .filter((t) => t.tipo === 'GASTO')
        .reduce((acc, t) => acc + t.valor, 0);
      
      const saldo = receitas - gastos;

      return {
        id: inst.id,
        nome: inst.nome,
        icone: inst.icone,
        cor: inst.cor,
        tipo: inst.type,
        valor: saldo,
        porcentagem: 0,
      };
    });

    const saldosNaoNegativos = saldosPorInstituicao.filter((s) => s.valor >= 0);
    saldosNaoNegativos.sort((a, b) => b.valor - a.valor);

    const totalSaldos = saldosNaoNegativos
      .filter((s) => s.valor > 0)
      .reduce((acc, s) => acc + s.valor, 0);
    
    const saldosComPorcentagem = saldosNaoNegativos.map((s) => ({
      ...s,
      porcentagem: totalSaldos > 0 ? Math.round((s.valor / totalSaldos) * 100) : 0,
    }));

    return saldosComPorcentagem.slice(0, limite);
  } catch (error) {
    console.error('Erro ao buscar saldos por instituição:', error);
    throw error;
  }
};


/**
 * Calcula a previsão de saldo com base em transações recorrentes e parceladas.
 * Projeta a partir de amanhã até `diasFuturos` dias no futuro.
 * O valor nos pontos é sempre o total acumulado (saldo previsto naquele dia).
 */
export const buscarPrevisaoSaldo = async (
  usuarioId: number,
  diasFuturos = 90,
): Promise<DadosPrevisaoSaldoApi> => {
  try {
    // ─────────────────────────────────────────────────────────────────
    // TODO: substituir pelo endpoint dedicado quando o backend estiver pronto
    //
    // REQUEST:
    //   GET /dashboard/previsao-saldo?usuarioId=1&diasFuturos=90
    //   Headers: { Authorization: 'Bearer <token>' }
    //
    // RESPONSE esperado (toda a lógica de projeção de recorrências e
    // parcelas fica no backend — o front só renderiza os pontos prontos):
    //   {
    //     "saldoAtual": 5230.50,
    //     "saldoFinal": 1340.70,
    //     "diasFuturos": 90,
    //     "pontos": [
    //       { "label": "Hoje",  "saldo": 5230.50, "dataISO": "2026-02-27" },
    //       { "label": "01/03", "saldo": 4530.50, "dataISO": "2026-03-01" },
    //       { "label": "02/03", "saldo": 4080.50, "dataISO": "2026-03-02" },
    //       { "label": "05/03", "saldo": 3080.50, "dataISO": "2026-03-05" },
    //       { "label": "10/03", "saldo": 2817.80, "dataISO": "2026-03-10" },
    //       { "label": "15/03", "saldo": 2727.90, "dataISO": "2026-03-15" },
    //       { "label": "20/03", "saldo": 2277.90, "dataISO": "2026-03-20" }
    //     ]
    //   }
    //
    // Como a função ficará depois da migração:
    //
    //   export const buscarPrevisaoSaldo = async (usuarioId, diasFuturos = 90) => {
    //     try {
    //       const response = await api.get(`/dashboard/previsao-saldo?usuarioId=${usuarioId}&diasFuturos=${diasFuturos}`);
    //
    //       // Caso o backend envie a data formatada ("27/02") em vez de "Hoje"
    //       // para o ponto atual, normalizarLabelHoje converte para "Hoje".
    //       // Se o backend já enviar "Hoje", a função devolve o label sem alterar.
    //       return {
    //         ...response.data,
    //         pontos: response.data.pontos.map(p => ({
    //           ...p,
    //           label: normalizarLabelHoje(p.label, p.dataISO),
    //         })),
    //       };
    //     } catch (error) {
    //       console.error('Erro ao buscar previsão de saldo:', error);
    //       throw error;
    //     }
    //   };
    // ─────────────────────────────────────────────────────────────────

    const [responseTransacoes, responseInstituicoes] = await Promise.all([
      api.get<TransacaoApi[]>('/transacao'),
      api.get<InstituicaoApi[]>(`/instituicoes?fkUsuario=${usuarioId}`),
    ]);

    const todasTransacoes = responseTransacoes.data;
    const instituicoesUsuario = responseInstituicoes.data;
    const idsInstituicoes = instituicoesUsuario.map((i) => i.id);
    const transacoesUsuario = todasTransacoes.filter((t) =>
      idsInstituicoes.includes(t.fkInstituicao)
    );

    // Hoje às 23:59:59 — inclui tudo que aconteceu hoje
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    // Amanhã às 00:00 — início do período de previsão
    const amanha = new Date();
    amanha.setHours(0, 0, 0, 0);
    amanha.setDate(amanha.getDate() + 1);

    // Fim do período
    const fimPeriodo = new Date(amanha);
    fimPeriodo.setDate(fimPeriodo.getDate() + diasFuturos - 1);

    // 1. Saldo atual = tudo que aconteceu até hoje
    const saldoAtual = transacoesUsuario
      .filter((t) => new Date(t.dataTransacao) <= hoje)
      .reduce((acc, t) => acc + (t.tipo === 'RECEITA' ? t.valor : -t.valor), 0);

    // 2. Projetar transações futuras
    const transacoesFuturas: ProjecaoFutura[] = [];

    transacoesUsuario.forEach((t) => {
      // Extrair ano/mês/dia diretamente da string ISO para evitar conversão UTC→local
      // que causaria shift de -1 dia em fusos negativos (ex: UTC-3 Brasil)
      const [anoOrig, mesOrig, diaOrig] = t.dataTransacao.split('T')[0].split('-').map(Number);
      const dataOrigem = new Date(anoOrig, mesOrig - 1, diaOrig); // local midnight, sem shift
      const sinal = t.tipo === 'RECEITA' ? 1 : -1;

      if (t.recorrencia === 'MENSAL') {
        // Avança até a primeira ocorrência no futuro
        let d = new Date(dataOrigem.getFullYear(), dataOrigem.getMonth(), dataOrigem.getDate());
        while (d <= hoje) {
          d = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
        }
        // Projeta todas as ocorrências dentro do período
        while (d <= fimPeriodo) {
          transacoesFuturas.push({ data: new Date(d), delta: sinal * t.valor });
          d = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
        }
      } else if (t.parcelado && (t.qtdParcelas || 0) > 1) {
        // A 1ª parcela já foi na data de origem; projeta as demais mensalmente
        for (let i = 1; i < (t.qtdParcelas || 0); i++) {
          const dParcela = new Date(
            dataOrigem.getFullYear(),
            dataOrigem.getMonth() + i,
            dataOrigem.getDate()
          );
          dParcela.setHours(0, 0, 0, 0);
          if (dParcela > hoje && dParcela <= fimPeriodo) {
            transacoesFuturas.push({ data: dParcela, delta: sinal * t.valor });
          }
        }
      }
    });

    // 3. Agrupar deltas por data (ISO)
    const mapaData: Record<string, number> = {};
    transacoesFuturas.forEach((tf) => {
      const key = tf.data.toISOString().split('T')[0];
      mapaData[key] = (mapaData[key] || 0) + tf.delta;
    });

    // 4. Construir pontos do gráfico com saldo acumulado
    const datasOrdenadas = Object.keys(mapaData).sort();
    const hojeISO = new Date().toISOString().split('T')[0];

    const pontos: DadosPrevisaoSaldoApi['pontos'] = [{
      label: 'Hoje',
      saldo: Math.round(saldoAtual * 100) / 100,
      dataISO: hojeISO,
    }];

    let saldoAcum = saldoAtual;
    datasOrdenadas.forEach((iso) => {
      saldoAcum += mapaData[iso];
      const d = new Date(iso + 'T12:00:00');
      const dia = d.getDate().toString().padStart(2, '0');
      const mes = (d.getMonth() + 1).toString().padStart(2, '0');
      pontos.push({
        label: `${dia}/${mes}`,
        saldo: Math.round(saldoAcum * 100) / 100,
        dataISO: iso,
      });
    });

    return {
      pontos,
      saldoAtual: Math.round(saldoAtual * 100) / 100,
      saldoFinal: Math.round(saldoAcum * 100) / 100,
      diasFuturos,
    };
  } catch (error) {
    console.error('Erro ao buscar previsão de saldo:', error);
    throw error;
  }
};

/**
 * Busca saldo diário consolidado do usuário no período informado.
 * Endpoint: GET /saldo/consolidado/{fkUsuario}?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD
 */
export const buscarSaldoDiario = async (
  usuarioId: string | number,
  dataInicio: string,
  dataFim: string,
): Promise<SaldoDiario[]> => {
  const response = await api.get<SaldoDiario[]>(
    `/saldo/consolidado/${usuarioId}`,
    { params: { dataInicio, dataFim } },
  );
  return response.data;
};

/**
 * Retorna o saldo consolidado do usuário na data de hoje.
 * Endpoint: GET /saldo/usuario/{fkUsuario}?data=YYYY-MM-DD
 */
export const buscarSaldoConsolidadoAtual = async (usuarioId: string | number): Promise<number> => {
  const hoje = new Date().toISOString().split('T')[0];
  const response = await api.get<{ data: string; saldoTotal: number; totalReceitas: number; totalGastos: number }>(
    `/saldo/usuario/${usuarioId}`,
    { params: { data: hoje } },
  );
  return Number(response.data.saldoTotal);
};

/**
 * Busca todos os dados do dashboard
 */
export const buscarDadosDashboard = async (usuarioId: number): Promise<DadosDashboardApi> => {
  try {
    const [resumo, gastosPorCategoria, saldosPorInstituicao, previsaoSaldo] = await Promise.all([
      buscarResumoFinanceiro(usuarioId),
      buscarGastosPorCategoria(usuarioId, 3),
      buscarSaldosPorInstituicao(usuarioId, 50),
      buscarPrevisaoSaldo(usuarioId, 90),
    ]);

    return {
      resumo,
      gastosPorCategoria,
      saldosPorInstituicao,
      previsaoSaldo,
    };
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    throw error;
  }
};
