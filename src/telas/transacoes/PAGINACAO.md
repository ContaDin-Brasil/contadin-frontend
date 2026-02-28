# 📄 Sistema de Paginação - Transações

## 🎯 Visão Geral

Sistema de paginação infinita (infinite scroll) implementado na tela de transações, preparado para integração com backend.

## 🏗️ Arquitetura Atual

### Frontend (Mock)
Atualmente, a paginação é **simulada no frontend**:
- Busca todas as transações da API
- Aplica paginação localmente com limitede 20 itens por página
- Simula resposta paginada do backend

### Estrutura de Dados

```typescript
interface PaginatedResponse<T> {
  data: T[];           // Array de itens da página atual
  page: number;        // Página atual (1-based)
  limit: number;       // Itens por página
  total: number;       // Total de itens no banco
  totalPages: number;  // Total de páginas
  hasMore: boolean;    // Se há mais páginas
}
```

## 🔌 Como Integrar com Backend

### 1. Criar Endpoint Paginado

**Backend (Node.js/Express exemplo):**

```javascript
// GET /api/transacoes?page=1&limit=20
router.get('/transacoes', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  
  const [transacoes, total] = await Promise.all([
    db.transacao.findMany({
      where: { fk_usuario: req.user.id },
      orderBy: { data_transacao: 'desc' },
      skip: offset,
      take: limit,
    }),
    db.transacao.count({
      where: { fk_usuario: req.user.id }
    })
  ]);
  
  const totalPages = Math.ceil(total / limit);
  
  res.json({
    data: transacoes,
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages
  });
});
```

### 2. Atualizar Service no Frontend

**Em `src/api/services/transacaoService.js`:**

```javascript
const transacaoService = {
  // ... outros métodos existentes

  /**
   * Lista transações com paginação
   * @param {number} page - Número da página (1-based)
   * @param {number} limit - Itens por página
   * @returns {Promise<PaginatedResponse>}
   */
  listarPaginado: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/transacoes?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar transações paginadas:', error);
      throw error;
    }
  },
};
```

### 3. Atualizar Hook useGerenciarTransacoes

**Em `src/telas/transacoes/hooks/useGerenciarTransacoes.ts`:**

Remova a simulação e use a chamada real:

```typescript
const carregarDados = async () => {
  setLoading(true);
  setError(null);
  setPage(1);
  
  try {
    const [categoriasData, instituicoesData] = await Promise.all([
      categoriaService.listarPorUsuario(usuarioId),
      instituicaoService.listarPorUsuario(usuarioId)
    ]);
    
    // ✅ USAR ISSO (comentar simulação):
    const response = await transacaoService.listarPaginado(1, limit);
    
    setTransacoes(response.data);
    setTotalTransacoes(response.total);
    setHasMore(response.hasMore);
    setCategorias(categoriasData);
    setInstituicoes(instituicoesData);
    setUsandoDadosMockados(false);
  } catch (err: any) {
    // Fallback para dados mockados...
  } finally {
    setLoading(false);
  }
};

const carregarMaisTransacoes = async () => {
  if (loadingMore || !hasMore) return;

  const nextPage = page + 1;
  setLoadingMore(true);
  
  try {
    // ✅ USAR ISSO (comentar simulação):
    const response = await transacaoService.listarPaginado(nextPage, limit);
    
    setTransacoes(prev => [...prev, ...response.data]);
    setHasMore(response.hasMore);
    setPage(nextPage);
  } catch (err: any) {
    setError('Erro ao carregar mais transações');
  } finally {
    setLoadingMore(false);
  }
};
```

## 📊 Fluxo de Funcionamento

### Carregamento Inicial
```
1. Usuário abre a tela
2. carregarDados() é chamado
3. Backend retorna página 1 (20 itens)
4. FlatList renderiza os dados
```

### Infinite Scroll
```
1. Usuário rola até o fim da lista
2. onEndReached detecta (threshold: 0.5 = 50% do fim)
3. carregarMaisTransacoes() é chamado
4. Backend retorna próxima página
5. Novos itens são adicionados ao array existente
6. FlatList atualiza automaticamente
```

### Pull to Refresh
```
1. Usuário puxa lista para baixo
2. onRefresh é chamado
3. carregarDados() reseta para página 1
4. Lista é reconstruída do zero
```

## ⚙️ Configurações

### Itens por Página
```typescript
const [limit] = useState(20); // Alterar aqui
```

**Recomendações:**
- Mobile: 15-20 itens
- Tablet: 30-40 itens
- Desktop web: 50+ itens

### Threshold do Infinite Scroll
```typescript
onEndReachedThreshold={0.5} // 50% antes do fim
```

**Valores:**
- `0.1`: Carrega muito perto do fim (pode causar delay visível)
- `0.5`: Balanceado (recomendado)
- `1.0`: Carrega quando topo da última tela fica visível

## 🎨 Estados Visuais

### Loading Inicial
```jsx
{gerenciador.loading && <ActivityIndicator />}
```

### Loading More (Footer)
```jsx
{gerenciador.loadingMore && (
  <View>
    <ActivityIndicator />
    <Text>Carregando mais...</Text>
  </View>
)}
```

### Fim da Lista
```jsx
{!gerenciador.hasMore && (
  <Text>Você visualizou todas as transações</Text>
)}
```

### Lista Vazia
```jsx
<ListEmptyComponent>
  <Text>Nenhuma transação encontrada</Text>
</ListEmptyComponent>
```

## 🔍 Compatibilidade com Filtros e Busca

A paginação funciona **em conjunto** com:
- ✅ Busca dinâmica
- ✅ Filtros avançados (tipo, categorias, instituições)
- ✅ Ordenação
- ✅ Filtro por instituição selecionada
- ✅ Filtro de período

**Importante:** Filtros/busca são aplicados **depois** que os dados são carregados do backend.

Para filtros no backend, você precisará:

```javascript
// Exemplo: adicionar filtros à query
listarPaginado: async (page, limit, filtros) => {
  const params = new URLSearchParams({
    page,
    limit,
    ...(filtros.tipo !== 'TODOS' && { tipo: filtros.tipo }),
    ...(filtros.categorias.length && { categorias: filtros.categorias.join(',') }),
  });
  
  return api.get(`/transacoes?${params}`);
}
```

## 📈 Performance

### Otimizações Implementadas
- ✅ Debounce na busca (300ms)
- ✅ FlatList (renderiza apenas itens visíveis)
- ✅ keyExtractor otimizado
- ✅ Carregamento progressivo (infinite scroll)
- ✅ Pull-to-refresh manual

### Métricas Esperadas
- **Carregamento inicial:** < 1s (20 itens)
- **Carregamento incremental:** < 500ms (próxima página)
- **Uso de memória:** Proporcional aos itens carregados
- **Scroll fluido:** 60 FPS

### Otimização Futura
Se a lista ficar muito grande (1000+ itens), considere:
- Virtualização agressiva
- Limpar itens muito distantes do viewport
- Cache de imagens
- Paginação com "janelas" (carregar página anterior também)

## 🐛 Troubleshooting

### Carrega múltiplas vezes seguidas
**Causa:** `onEndReachedThreshold` muito alto ou lista muito pequena  
**Solução:** Ajustar threshold ou aumentar `limit`

### Não carrega mais páginas
**Causa:** `hasMore` setado incorretamente  
**Solução:** Verificar lógica no backend: `page < totalPages`

### Loading infinito
**Causa:** Erro na requisição não tratado  
**Solução:** Verificar tratamento de erro em `carregarMaisTransacoes()`

### Itens duplicados
**Causa:** Estado não resetado ao fazer refresh  
**Solução:** Garantir que `setPage(1)` e limpar array em `carregarDados()`

## 📚 Referências

- [FlatList - React Native](https://reactnative.dev/docs/flatlist)
- [Infinite Scroll Best Practices](https://www.smashingmagazine.com/2013/05/infinite-scrolling-best-practices/)
- [REST API Pagination](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/)

## 🚀 Próximos Passos

1. ✅ Implementar paginação no frontend (FEITO)
2. ⏳ Criar endpoint paginado no backend
3. ⏳ Conectar frontend ao backend
4. ⏳ Adicionar filtros no backend
5. ⏳ Implementar cache de páginas anteriores
6. ⏳ Analytics de performance

---

**Data de implementação:** 28/02/2026  
**Autor:** Sistema de IA  
**Versão:** 1.0.0
