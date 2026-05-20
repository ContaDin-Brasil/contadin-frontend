# Integração do Endpoint `/indicadores-transacoes`

## Visão Geral

O novo endpoint `/indicadores-transacoes` do backend fornece dados agregados de gastos e receitas por período, eliminando a necessidade de processar todas as transações no frontend.

**Endpoint Backend:**
```java
@GetMapping("/indicadores-transacoes")
public DashReceitaGastoResponse buscarReceita(
    @RequestParam(required = false) YearMonth periodo,
    TipoTransacao tipo,
    UUID usuarioId
)
```

**Response:**
```json
{
  "mes": 5,
  "tipo": "GASTO",
  "valorTotal": 350
}
```

---

## Funções Disponíveis

### 1. `buscarIndicadoresTransacoes(usuarioId, tipo, periodo?)`

Chama o endpoint `/indicadores-transacoes` diretamente.

**Parâmetros:**
- `usuarioId` (string): UUID do usuário
- `tipo` ('GASTO' | 'RECEITA'): Tipo de transação
- `periodo?` (string): Período no formato "YYYY-MM" (ex: "2026-05"). Se não informado, usa o mês atual.

**Retorno:**
```typescript
{
  mes: number;
  tipo: 'GASTO' | 'RECEITA';
  valorTotal: number;
}
```

**Exemplo:**
```typescript
import { buscarIndicadoresTransacoes } from '@/api/services/dashboardService';

// Buscar gastos de maio/2026
const dados = await buscarIndicadoresTransacoes(
  '123e4567-e89b-12d3-a456-426614174000', // UUID do usuário
  'GASTO',
  '2026-05'
);

console.log(dados);
// { mes: 5, tipo: 'GASTO', valorTotal: 350 }
```

---

### 2. `buscarResumoFinanceiroComIndicadores(usuarioId)`

Integra o novo endpoint para buscar o resumo financeiro completo (gastos + receitas + saldo).

**Parâmetros:**
- `usuarioId` (string): UUID do usuário

**Retorno:**
```typescript
{
  saldoTotal: number;
  receitaTotal: number;
  gastoTotal: number;
  mesAtual: string; // Formato: "Mai/2026"
}
```

**Exemplo:**
```typescript
import { buscarResumoFinanceiroComIndicadores } from '@/api/services/dashboardService';

const resumo = await buscarResumoFinanceiroComIndicadores(
  '123e4567-e89b-12d3-a456-426614174000'
);

console.log(resumo);
// {
//   saldoTotal: 450,
//   receitaTotal: 800,
//   gastoTotal: 350,
//   mesAtual: "Mai/2026"
// }
```

---

## Integração na Dashboard

Para integrar na dashboard, você precisa atualizar o hook `useGerenciarDashboard` para usar a nova função:

**Passo 1:** Atualize a função `carregarDados` no hook

```typescript
// Em: src/telas/dashboard/hooks/useGerenciarDashboard.ts

const carregarDados = useCallback(async (forcarAtualizacao = false) => {
  try {
    setLoading(true);
    setErro(null);

    // ... verificação de cache e mock ...

    // Buscar dados da API usando o novo endpoint
    const resumo = await buscarResumoFinanceiroComIndicadores(usuarioId.toString());
    
    const dadosApi = await buscarDadosDashboard(usuarioId);
    
    // Mesclar o novo resumo com os outros dados
    const dados = {
      ...dadosApi,
      resumo, // sobrescreve com o novo resumo
    };
    
    await setCache(`${CACHE_KEYS.RESUMO}:${usuarioId}`, dados, CACHE_TTL.RESUMO);
    setDados(dados);
    
  } catch (error) {
    console.error('[Dashboard] Erro ao carregar dados:', error);
    // fallback para mock
  }
}, [usuarioId, getCache, setCache]);
```

---

## Tipos TypeScript

Os tipos estão definidos em `src/api/types.ts`:

```typescript
/**
 * Resposta do endpoint /indicadores-transacoes
 */
export interface DashReceitaGastoResponse {
  mes: number;
  tipo: 'GASTO' | 'RECEITA';
  valorTotal: number;
}
```

---

## Benefícios

✅ **Performance:** Dados agregados no backend, sem processamento no frontend  
✅ **Escalabilidade:** Funciona bem com grandes volumes de dados  
✅ **Consistência:** Cálculos centralizados no backend  
✅ **Cache:** Fácil implementar cache com TTL  

---

## Próximos Passos

1. ✅ Tipos criados em `src/api/types.ts`
2. ✅ Funções criadas em `src/api/services/dashboardService.ts`
3. ⚠️ **TODO:** Atualizar o hook `useGerenciarDashboard` para usar `buscarResumoFinanceiroComIndicadores`
4. ⚠️ **TODO:** Testar integração com o backend
5. ⚠️ **TODO:** Remover lógica manual de cálculo quando o backend for 100% confiável
