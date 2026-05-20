# Fluxo de Integração - Indicadores Transações

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             DASHBOARD FRONTEND                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  TelaInicial.jsx (Dashboard)                                       │   │
│  │  - Mostra: Saldo Total, Receitas, Gastos                          │   │
│  │  - Usa: useGerenciarDashboard hook                                 │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                     │                                      │
│                                     ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  useGerenciarDashboard.ts (Hook Custom)                           │   │
│  │  - Gerencia estado dos dados                                      │   │
│  │  - Implementa cache                                               │   │
│  │  - Fallback para mock                                             │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                     │                                      │
│                                     ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  dashboardService.ts (API Service Layer)          ✨ NOVO ✨       │   │
│  │                                                                    │   │
│  │  ✅ buscarResumoFinanceiroComIndicadores()                        │   │
│  │     └─ Combina GASTO + RECEITA em 2 chamadas paralelas          │   │
│  │                                                                    │   │
│  │  ✅ buscarIndicadoresTransacoes(usuarioId, tipo, periodo)        │   │
│  │     └─ Chama um tipo específico por período                      │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                     │                                      │
│                                     ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  api/config.ts (HTTP Client - Axios)                             │   │
│  │  - Interceptadores                                               │   │
│  │  - Autenticação (Bearer Token)                                    │   │
│  │  - Tratamento de erros                                            │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                        ┌───────────────┼───────────────┐
                        ▼               ▼               ▼
                   (INTERNET)    (BACKEND NO)    (MOCK)
                    ┌─────────────────────────────────┐
                    │  Backend Java (Spring Boot)     │
                    │ /indicadores-transacoes         │
                    │ @GetMapping                     │
                    │                                 │
                    │ Parâmetros:                    │
                    │ - periodo: YearMonth            │
                    │ - tipo: GASTO|RECEITA           │
                    │ - usuarioId: UUID               │
                    │                                 │
                    │ Response:                       │
                    │ {                               │
                    │   "mes": 5,                     │
                    │   "tipo": "GASTO",              │
                    │   "valorTotal": 350             │
                    │ }                               │
                    └─────────────────────────────────┘
```

---

## Fluxo de Dados - Buscar Resumo Financeiro

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. Usuario abre Dashboard                                           │
├─────────────────────────────────────────────────────────────────────┤
│ ✓ useGerenciarDashboard() é inicializado                            │
│ ✓ carregarDados() é chamado automaticamente via useEffect            │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 2. Verificar Cache                                                  │
├─────────────────────────────────────────────────────────────────────┤
│ ✓ Existe cache válido (não expirado)?                               │
│   ├─ SIM  → Retorna dados do cache → PRONTO ✅                      │
│   └─ NÃO  → Continua para próxima etapa                             │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 3. Chamar buscarResumoFinanceiroComIndicadores()                   │
├─────────────────────────────────────────────────────────────────────┤
│ ✓ Converte usuarioId para string                                    │
│ ✓ Faz 2 chamadas PARALELAS:                                         │
│                                                                     │
│   Promise.all([                                                     │
│     buscarIndicadoresTransacoes(id, 'GASTO'),                       │
│     buscarIndicadoresTransacoes(id, 'RECEITA')                      │
│   ])                                                                │
│                                                                     │
│ ✓ Aguarda ambas as respostas                                        │
└─────────────────────────────────────────────────────────────────────┘
         │                                       │
         ▼                                       ▼
    ┌──────────────┐                    ┌──────────────┐
    │ /indicadores │                    │ /indicadores │
    │ -transacoes? │                    │ -transacoes? │
    │ tipo=GASTO   │                    │ tipo=RECEITA │
    └──────────────┘                    └──────────────┘
         │                                       │
         ▼                                       ▼
    { mes: 5,          (paralelamente)      { mes: 5,
      tipo: "GASTO",                         tipo: "RECEITA",
      valorTotal:350 }                       valorTotal: 800 }
    
         │                                       │
         └───────────────────┬───────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 4. Processar Respostas                                              │
├─────────────────────────────────────────────────────────────────────┤
│ ✓ gastoTotal = 350                                                  │
│ ✓ receitaTotal = 800                                                │
│ ✓ saldoTotal = 800 - 350 = 450                                      │
│ ✓ mesAtual = "Mai/2026"                                             │
│                                                                     │
│ Retorna:                                                            │
│ {                                                                   │
│   saldoTotal: 450,                                                  │
│   receitaTotal: 800,                                                │
│   gastoTotal: 350,                                                  │
│   mesAtual: "Mai/2026"                                              │
│ }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 5. Cachear Resultado                                                │
├─────────────────────────────────────────────────────────────────────┤
│ ✓ Salva no cache com TTL (ex: 5 minutos)                            │
│ ✓ Próxima verificação usará o cache                                 │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 6. Render Dashboard                                                 │
├─────────────────────────────────────────────────────────────────────┤
│ ✓ CardResumo mostra:                                                │
│   - Saldo Total: R$ 450,00                                          │
│   - Receitas:   R$ 800,00                                           │
│   - Gastos:     R$ 350,00                                           │
│                                                                     │
│ ✓ Dashboard atualizada com dados reais ✅                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Comparação: Antes vs Depois

### ❌ ANTES (Sem o novo endpoint)

```
Usuario abre Dashboard
         │
         ▼
   Carregar dados
         │
         ├─ GET /transacao → 1000+ registros
         │
         ├─ GET /instituicao?fk_usuario=1 → 5 instituições
         │
         └─ GET /categoria → 20 categorias
                  │
                  ▼
         [FRONTEND] Processar:
         - Filter por instituições do usuário
         - Filter por categoria
         - Filter por mês
         - Reduce para calcular totais
         - Sort e aggregate
                  │
                  ▼
         Dashboard mostra resultado
         
⏱️ Tempo: 2-3s (com muitos dados pode ser mais)
📊 Dados: ~ 500KB
⚡ CPU Frontend: Alto (filtragem + agregação)
```

### ✅ DEPOIS (Com novo endpoint)

```
Usuario abre Dashboard
         │
         ▼
   Carregar dados
         │
         ├─ GET /indicadores-transacoes?tipo=GASTO
         │   (paralelamente)
         │
         └─ GET /indicadores-transacoes?tipo=RECEITA
                  │
                  ▼
         {mes: 5, tipo: "GASTO", valorTotal: 350}
         {mes: 5, tipo: "RECEITA", valorTotal: 800}
                  │
                  ▼
         [FRONTEND] Apenas combinar:
         saldoTotal = 800 - 350
                  │
                  ▼
         Dashboard mostra resultado

⏱️ Tempo: 300-500ms
📊 Dados: ~ 1KB
⚡ CPU Frontend: Mínimo (apenas soma)
```

---

## Diagrama de Estados (Hook)

```
                    ┌─────────────────────┐
                    │   INICIAL           │
                    │ loading: true       │
                    │ dados: null         │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
            [Cache]        [API Error]   [API Success]
            loading:         loading:        loading:
            false            false           false
            dados:           erro:true       dados:✓
            ✓                dados:null      erro:null
            erro:null        └──────────┬────────────────────┐
            │                           │                    │
            │                    [Fallback Mock]      [Usar Dados]
            │                           │                    │
            └───────────────┬───────────┴────────────────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │   PRONTO         │
                    │ Renderizar       │
                    │ Dashboard        │
                    └───────┬──────────┘
                            │
                            ▼ (Pull to Refresh)
                    ┌──────────────────┐
                    │   ATUALIZANDO    │
                    │ atualizando:true │
                    │ (fundo)          │
                    └──────────────────┘
```

---

## Hierarquia de Chamadas

```
TelaInicial (Dashboard)
    │
    └─ useGerenciarDashboard()
            │
            ├─ buscarDadosDashboard() [existente]
            │   ├─ buscarResumoFinanceiro() ← ANTES
            │   ├─ buscarGastosPorCategoria()
            │   ├─ buscarSaldosPorInstituicao()
            │   └─ buscarPrevisaoSaldo()
            │
            └─ buscarResumoFinanceiroComIndicadores() ← NOVO ✨
                    │
                    └─ Promise.all([
                         buscarIndicadoresTransacoes(id, 'GASTO'),
                         buscarIndicadoresTransacoes(id, 'RECEITA')
                       ])
                           │
                           ├─ GET /indicadores-transacoes?tipo=GASTO
                           └─ GET /indicadores-transacoes?tipo=RECEITA
```

---

## Tratamento de Erros

```
buscarResumoFinanceiroComIndicadores()
    │
    ├─ try
    │   ├─ Promise.all([...]) → Sucesso ✅
    │   └─ return resumo
    │
    └─ catch
        ├─ console.error('[Dashboard] Erro...')
        ├─ Fallback para buildMockDashboardData()
        └─ return mockResumo
```

---

## Checklist Visual

| Componente | Status | Descrição |
|-----------|--------|-----------|
| 🔧 Tipos criados | ✅ | `DashReceitaGastoResponse` em `types.ts` |
| 🔧 Função endpoint | ✅ | `buscarIndicadoresTransacoes()` |
| 🔧 Função consolidada | ✅ | `buscarResumoFinanceiroComIndicadores()` |
| 📖 Documentação | ✅ | `INTEGRACAO_INDICADORES_TRANSACOES.md` |
| 📖 Exemplos | ✅ | `exemplos-uso-indicadores.ts` |
| 📖 Checklist | ✅ | `CHECKLIST_IMPLEMENTACAO.md` |
| ⏳ Backend | 🔄 | Endpoint `/indicadores-transacoes` |
| ⏳ Integração Dashboard | 🔄 | Atualizar `useGerenciarDashboard` |
| ⏳ Testes | 🔄 | E2E + unitários |

---

**Próximo passo:** Implementar no `useGerenciarDashboard` conforme indicado no checklist.
