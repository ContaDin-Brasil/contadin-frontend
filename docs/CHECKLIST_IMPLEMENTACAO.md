# Checklist de Implementação - Endpoint `/indicadores-transacoes`

## 📋 Status da Integração

### ✅ Concluído

- [x] **Tipos TypeScript criados**
  - Arquivo: `src/api/types.ts`
  - Tipo: `DashReceitaGastoResponse`
  - Interface com campos: `mes`, `tipo`, `valorTotal`

- [x] **Funções de serviço criadas**
  - Arquivo: `src/api/services/dashboardService.ts`
  - Função 1: `buscarIndicadoresTransacoes()` - chamada ao endpoint
  - Função 2: `buscarResumoFinanceiroComIndicadores()` - resumo consolidado

- [x] **Documentação**
  - Arquivo: `docs/INTEGRACAO_INDICADORES_TRANSACOES.md`
  - Exemplos de uso em: `src/api/services/exemplos-uso-indicadores.ts`

---

## 🔧 Passo a Passo para Implementação

### Passo 1: Verificar o Endpoint do Backend

```bash
# Testar o endpoint manualmente
curl -X GET "http://localhost:8080/indicadores-transacoes?periodo=2026-05&tipo=GASTO&usuarioId=a1b2c3d4-e5f6-7890-abcd-ef1234567890"

# Resposta esperada:
{
  "mes": 5,
  "tipo": "GASTO",
  "valorTotal": 350
}
```

### Passo 2: Usar o Hook useResumoFinanceiroMelhorado

Copie o exemplo do arquivo `src/api/services/exemplos-uso-indicadores.ts` e use em um componente:

```typescript
import { useResumoFinanceiroMelhorado } from '@/api/services/exemplos-uso-indicadores';

export const MeuComponente = () => {
  const { resumo, loading, erro, atualizar } = useResumoFinanceiroMelhorado();

  if (loading) return <Text>Carregando...</Text>;
  if (erro) return <Text>Erro: {erro}</Text>;

  return (
    <View>
      <Text>Saldo Total: R$ {resumo?.saldoTotal}</Text>
      <Text>Receitas: R$ {resumo?.receitaTotal}</Text>
      <Text>Gastos: R$ {resumo?.gastoTotal}</Text>
    </View>
  );
};
```

### Passo 3: Atualizar useGerenciarDashboard (Opcional)

Se quiser integrar à dashboard existente:

1. Abra: `src/telas/dashboard/hooks/useGerenciarDashboard.ts`
2. Importe: `buscarResumoFinanceiroComIndicadores`
3. Substitua a lógica de `buscarResumoFinanceiro()` pela nova função
4. Faça as chamadas paralelas conforme mostrado no exemplo

**Antes:**
```typescript
const resumo = await buscarResumoFinanceiro(usuarioId);
```

**Depois:**
```typescript
const resumo = await buscarResumoFinanceiroComIndicadores(String(usuarioId));
```

### Passo 4: Testar Localmente

```bash
# 1. Inicie o backend (se em desenvolvimento)
# 2. Inicie o frontend React Native
# 3. Acesse a dashboard
# 4. Verifique no console se os dados foram carregados do novo endpoint
```

---

## 🧪 Testes Recomendados

### Teste 1: Verificar se o endpoint está acessível

```typescript
import { buscarIndicadoresTransacoes } from '@/api/services/dashboardService';

// Testar
await buscarIndicadoresTransacoes(
  '123e4567-e89b-12d3-a456-426614174000',
  'GASTO'
);
```

### Teste 2: Verificar formatação dos dados

```typescript
const resultado = await buscarIndicadoresTransacoes(id, 'GASTO');

console.assert(typeof resultado.mes === 'number', 'mes deve ser number');
console.assert(resultado.tipo === 'GASTO', 'tipo deve ser GASTO');
console.assert(typeof resultado.valorTotal === 'number', 'valorTotal deve ser number');
```

### Teste 3: Verificar função consolidada

```typescript
import { buscarResumoFinanceiroComIndicadores } from '@/api/services/dashboardService';

const resumo = await buscarResumoFinanceiroComIndicadores('123e4567-e89b-12d3-a456-426614174000');

console.log('Saldo Total:', resumo.saldoTotal);
console.log('Receita Total:', resumo.receitaTotal);
console.log('Gasto Total:', resumo.gastoTotal);
console.log('Mês Atual:', resumo.mesAtual);
```

---

## 🚨 Possíveis Problemas e Soluções

### Problema 1: "Cannot GET /indicadores-transacoes"

**Causa:** Endpoint não está implementado no backend ou a rota está incorreta

**Solução:**
1. Verifique se o backend está rodando
2. Confirme a URL exata: `GET /indicadores-transacoes`
3. Certifique-se de que o `usuarioId` está sendo passado como parâmetro

### Problema 2: "TypeError: Cannot read property 'valorTotal' of undefined"

**Causa:** A resposta do backend não contém os campos esperados

**Solução:**
1. Verifique se a resposta do backend tem: `mes`, `tipo`, `valorTotal`
2. Adicione validação no frontend:

```typescript
export const buscarIndicadoresTransacoes = async (...) => {
  const response = await api.get<DashReceitaGastoResponse>(...);
  
  // Validar resposta
  if (!response.data.valorTotal) {
    throw new Error('Campo valorTotal não encontrado na resposta');
  }
  
  return response.data;
};
```

### Problema 3: Dashboard mostra dados antigos/cache expirado

**Causa:** Cache não está sendo invalidado corretamente

**Solução:**
```typescript
// Forçar atualização
const atualizarDados = useCallback(async () => {
  await invalidateCache(`${CACHE_KEYS.RESUMO}:${usuarioId}`);
  await carregarDados(true);
}, [usuarioId, invalidateCache, carregarDados]);
```

### Problema 4: "usuarioId is not a valid UUID"

**Causa:** O ID está sendo passado como number ao invés de string

**Solução:**
```typescript
// ❌ ERRADO
await buscarIndicadoresTransacoes(123, 'GASTO');

// ✅ CORRETO
await buscarIndicadoresTransacoes(String(123), 'GASTO');
// ou se já é UUID
await buscarIndicadoresTransacoes(user.id.toString(), 'GASTO');
```

---

## 📊 Comparação de Performance

### Antes (Cálculo no Frontend)

```typescript
// Buscar TODAS as transações
const todasTransacoes = await api.get('/transacao'); // 1000+ registros?
// Buscar TODAS as instituições
const instituicoes = await api.get(`/instituicao?fk_usuario=${id}`);
// Processar tudo no frontend (filter, reduce, etc)
const gastoTotal = transacoes.filter(...).reduce(...);
```

**Impacto:**
- ⬆️ Tamanho da resposta: Alto
- ⬆️ Processamento no frontend: Alto
- ⚠️ Performance: Lenta com muitos dados

### Depois (Cálculo no Backend)

```typescript
// Buscar apenas o resumo agregado
const resumo = await buscarResumoFinanceiroComIndicadores(usuarioId);
// { mes: 5, tipo: "GASTO", valorTotal: 350 }
```

**Impacto:**
- ⬇️ Tamanho da resposta: Mínimo
- ⬇️ Processamento no frontend: Nenhum
- ✅ Performance: Rápida

---

## 📚 Arquivos Modificados/Criados

| Arquivo | Tipo | Status | Descrição |
|---------|------|--------|-----------|
| `src/api/types.ts` | Modified | ✅ | Added `DashReceitaGastoResponse` type |
| `src/api/services/dashboardService.ts` | Modified | ✅ | Added `buscarIndicadoresTransacoes()` and `buscarResumoFinanceiroComIndicadores()` |
| `docs/INTEGRACAO_INDICADORES_TRANSACOES.md` | Created | ✅ | Main documentation |
| `src/api/services/exemplos-uso-indicadores.ts` | Created | ✅ | Usage examples and integration patterns |
| `docs/CHECKLIST_IMPLEMENTACAO.md` | Created | ✅ | This file |

---

## 🎯 Próximos Passos

1. ✅ Revisar a documentação em `docs/INTEGRACAO_INDICADORES_TRANSACOES.md`
2. ⏳ Testar o endpoint do backend
3. ⏳ Integrar no hook `useGerenciarDashboard` (se necessário)
4. ⏳ Testar a dashboard
5. ⏳ Remover lógica manual de cálculo quando tudo funcionar

---

## 💡 Dicas Finais

✨ **Use sempre a função `buscarResumoFinanceiroComIndicadores()`** quando precisar de gastos + receitas + saldo, pois ela faz as chamadas paralelas automaticamente.

🔄 **Implemente cache com TTL** para evitar chamadas desnecessárias ao backend.

🧪 **Teste com e sem internet** para garantir fallback para mock.

📱 **Monitore o console** para identificar erros rapidamente.

---

**Dúvidas?** Consulte os exemplos em `src/api/services/exemplos-uso-indicadores.ts`
