# 📐 Arquitetura de API para Backend

Este documento explica como a aplicação atual lida com filtros, ordenação e paginação, e como preparar a integração com um backend real que suporte essas funcionalidades.

---

## 🎯 Visão Geral

### Estado Atual (Frontend)
Atualmente, a aplicação:
- **Busca TODAS as transações** da API
- **Filtra, ordena e pagina no FRONTEND** (em memória)
- Usa o JSON Server como API de mock (sem suporte robusto a queries complexas)

### Estado Futuro (Backend)
Com um backend real, a aplicação irá:
- **Buscar APENAS os dados necessários** da API
- **Filtrar, ordenar e paginar no BACKEND** (via query parameters)
- Reduzir consumo de dados e melhorar performance

---

## 📊 Arquitetura Atual

### 1. Camada de Serviços API (`src/api/services/`)

Responsável por fazer requisições HTTP para o backend.

```javascript
// transacaoService.js
const transacaoService = {
  // Busca TODAS as transações (não escalável)
  listar: async () => {
    const response = await api.get('/transacao');
    return response.data;
  },

  // Busca com filtro simples (limitado)
  listarPorTipo: async (tipo) => {
    const response = await api.get('/transacao', { 
      params: { tipo } 
    });
    return response.data;
  },
};
```

**Problema**: Busca todos os dados e depois filtra no frontend.

---

### 2. Camada de Hooks (`src/telas/transacoes/hooks/`)

Gerencia estado e lógica de negócio, conectando UI aos serviços.

```typescript
// useGerenciarTransacoes.ts
export const useGerenciarTransacoes = () => {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({...});
  const [ordenacao, setOrdenacao] = useState('Mais recentes');

  // Carrega TODAS as transações
  const carregarDados = async () => {
    const transacoesData = await transacaoService.listar();
    setTransacoes(transacoesData);
  };

  return { transacoes, filtros, ordenacao, ... };
};
```

**Problema**: Armazena TODOS os dados em memória e usa utilities para filtrar/ordenar.

---

### 3. Camada de UI (`src/telas/transacoes/`)

Renderiza dados e captura interações do usuário.

```javascript
// TelaTransacoes.js
const transacoesFiltradas = aplicarFiltros(
  gerenciador.transacoes, 
  gerenciador.filtros,
  searchQuery
);

const transacoesOrdenadas = ordenarTransacoes(
  transacoesFiltradas, 
  gerenciador.ordenacao
);
```

**Problema**: Filtra/ordena no frontend a cada renderização.

---

## 🔧 Migração para Backend

### Etapa 1: Criar Endpoint de Listagem com Parâmetros

O backend deve suportar query parameters para filtros, ordenação e paginação.

#### **Endpoint Proposto**

```
GET /api/transacoes?page=1&limit=20&sort=-data&tipo=GASTO&categorias=1,2,3&instituicoes=4,5&valorMin=100&valorMax=500&dataInicio=2024-01-01&dataFim=2024-12-31&parcelado=true&recorrente=false
```

#### **Query Parameters**

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `page` | number | Página atual (começa em 1) | `page=1` |
| `limit` | number | Itens por página | `limit=20` |
| `sort` | string | Campo e ordem (`-` = DESC) | `sort=-data` ou `sort=valor` |
| `tipo` | string | Filtro por tipo | `tipo=GASTO` ou `tipo=RECEITA` |
| `categorias` | string | IDs separados por vírgula | `categorias=1,2,3` |
| `instituicoes` | string | IDs separados por vírgula | `instituicoes=4,5,6` |
| `valorMin` | number | Valor mínimo | `valorMin=100` |
| `valorMax` | number | Valor máximo | `valorMax=500` |
| `dataInicio` | date | Data inicial (YYYY-MM-DD) | `dataInicio=2024-01-01` |
| `dataFim` | date | Data final (YYYY-MM-DD) | `dataFim=2024-12-31` |
| `parcelado` | boolean | Apenas parceladas | `parcelado=true` |
| `recorrente` | boolean | Apenas recorrentes | `recorrente=true` |
| `search` | string | Busca por descrição | `search=mercado` |

#### **Resposta Esperada**

```json
{
  "data": [
    {
      "id": 1,
      "descricao": "Compras no mercado",
      "tipo": "GASTO",
      "valor": 250.50,
      "data_transacao": "2024-01-15",
      "fk_categoria": 2,
      "fk_instituicao": 4,
      "parcelamento": null,
      "recorrencia": null
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### Etapa 2: Atualizar Serviço de API

Criar uma função unificada que aceita todos os parâmetros.

```javascript
// transacaoService.js
const transacaoService = {
  /**
   * Lista transações com filtros, ordenação e paginação
   * @param {Object} params - Parâmetros de busca
   * @returns {Promise<{data: Array, meta: Object}>}
   */
  listarComFiltros: async (params) => {
    const {
      page = 1,
      limit = 20,
      sort = '-data_transacao',
      tipo,
      categorias,
      instituicoes,
      valorMin,
      valorMax,
      dataInicio,
      dataFim,
      parcelado,
      recorrente,
      search
    } = params;

    // Monta query parameters (remove valores vazios)
    const queryParams = Object.entries({
      page,
      limit,
      sort,
      tipo: tipo !== 'TODOS' ? tipo : undefined,
      categorias: categorias?.length > 0 ? categorias.join(',') : undefined,
      instituicoes: instituicoes?.length > 0 ? instituicoes.join(',') : undefined,
      valorMin,
      valorMax,
      dataInicio,
      dataFim,
      parcelado: parcelado ? 'true' : undefined,
      recorrente: recorrente ? 'true' : undefined,
      search
    })
      .filter(([_, value]) => value !== undefined && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    console.log('🌐 [API] Listando transações com parâmetros:', queryParams);

    const response = await api.get('/transacoes', { params: queryParams });
    
    return {
      data: response.data.data || response.data,
      meta: response.data.meta || {
        page,
        limit,
        total: response.data.length,
        totalPages: Math.ceil(response.data.length / limit)
      }
    };
  },

  // Mantém métodos antigos para compatibilidade
  listar: async () => {
    const response = await transacaoService.listarComFiltros({});
    return response.data;
  },
};

export default transacaoService;
```

---

### Etapa 3: Atualizar Hook de Gerenciamento

Modificar o hook para usar o novo serviço e gerenciar paginação.

```typescript
// useGerenciarTransacoes.ts
export interface Filtros {
  tipo: 'TODOS' | 'RECEITA' | 'GASTO';
  instituicoes: number[];
  categorias: number[];
  valorMin: string;
  valorMax: string;
  apenasParcelado: boolean;
  apenasRecorrente: boolean;
  dataInicio: string;
  dataFim: string;
}

export interface MetaPaginacao {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const useGerenciarTransacoes = () => {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<Filtros>({...});
  const [ordenacao, setOrdenacao] = useState('Mais recentes');
  const [searchQuery, setSearchQuery] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [meta, setMeta] = useState<MetaPaginacao>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  /**
   * Mapeia ordenação do UI para campo da API
   */
  const mapearOrdenacao = (ordenacao: string): string => {
    const map: Record<string, string> = {
      'Mais recentes': '-data_transacao',
      'Mais antigas': 'data_transacao',
      'Maior valor': '-valor',
      'Menor valor': 'valor',
      'A-Z': 'descricao',
      'Z-A': '-descricao',
    };
    return map[ordenacao] || '-data_transacao';
  };

  /**
   * Carrega transações da API com filtros aplicados
   */
  const carregarTransacoes = async () => {
    setLoading(true);
    
    try {
      const resultado = await transacaoService.listarComFiltros({
        page: paginaAtual,
        limit: 20,
        sort: mapearOrdenacao(ordenacao),
        tipo: filtros.tipo,
        categorias: filtros.categorias,
        instituicoes: filtros.instituicoes,
        valorMin: filtros.valorMin,
        valorMax: filtros.valorMax,
        dataInicio: filtros.dataInicio,
        dataFim: filtros.dataFim,
        parcelado: filtros.apenasParcelado,
        recorrente: filtros.apenasRecorrente,
        search: searchQuery
      });
      
      setTransacoes(resultado.data);
      setMeta(resultado.meta);
      
      console.log(`📊 [LOAD] Carregadas ${resultado.data.length} transações`);
      console.log(`📊 [LOAD] Página ${resultado.meta.page} de ${resultado.meta.totalPages}`);
      
    } catch (err: any) {
      console.error('❌ [ERROR] Erro ao carregar transações:', err);
      setError(err.message || 'Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Recarrega transações quando filtros/ordenação/página mudam
   */
  useEffect(() => {
    carregarTransacoes();
  }, [filtros, ordenacao, searchQuery, paginaAtual]);

  /**
   * Volta para página 1 quando filtros mudam
   */
  const aplicarFiltros = (novosFiltros: Filtros) => {
    setFiltros(novosFiltros);
    setPaginaAtual(1);
  };

  /**
   * Carrega próxima página
   */
  const carregarProximaPagina = () => {
    if (paginaAtual < meta.totalPages) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  /**
   * Carrega página anterior
   */
  const carregarPaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  return {
    // Estados
    transacoes,
    loading,
    filtros,
    ordenacao,
    searchQuery,
    paginaAtual,
    meta,
    
    // Modificadores
    setFiltros: aplicarFiltros,
    setOrdenacao,
    setSearchQuery,
    setPaginaAtual,
    
    // Ações
    carregarTransacoes,
    carregarProximaPagina,
    carregarPaginaAnterior,
  };
};
```

---

### Etapa 4: Atualizar UI (Opcional - Infinite Scroll)

Se quiser adicionar scroll infinito no lugar de paginação tradicional:

```javascript
// TelaTransacoes.js
import { FlatList } from 'react-native';

const TelaTransacoes = () => {
  const gerenciador = useGerenciarTransacoes();

  const handleLoadMore = () => {
    if (!gerenciador.loading && gerenciador.paginaAtual < gerenciador.meta.totalPages) {
      gerenciador.carregarProximaPagina();
    }
  };

  return (
    <FlatList
      data={gerenciador.transacoes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <TransacaoCard transacao={item} />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={gerenciador.loading ? <LoadingSpinner /> : null}
    />
  );
};
```

---

## 🎨 Removendo Utilities de Frontend

Após implementar filtros no backend, você pode **remover ou simplificar** as funções de utilities:

```typescript
// utilitariosTransacao.ts (ANTES - filtra no frontend)
export const aplicarFiltros = (
  transacoes: any[],
  filtros: Filtros,
  searchQuery: string
): any[] => {
  // 100+ linhas de lógica de filtro...
};

// utilitariosTransacao.ts (DEPOIS - simplificado)
// Remova aplicarFiltros completamente ou mantenha apenas para fallback offline
```

As utilities podem ser mantidas como **fallback para modo offline**, mas não devem ser usadas quando a API estiver disponível.

---

## 📦 Resumo de Mudanças

### O que MANTER:
- ✅ **Estrutura de pastas** (`api/`, `hooks/`, `telas/`)
- ✅ **Interface de Filtros** (mesmo formato de dados)
- ✅ **Modais de filtro/ordenação/período** (UI permanece igual)
- ✅ **Utilities de formatação** (`formatCurrency`, `formatDateLabel`, etc.)

### O que MODIFICAR:
- 🔄 **transacaoService.js** → Adicionar `listarComFiltros()`
- 🔄 **useGerenciarTransacoes.ts** → Chamar API com parâmetros
- 🔄 **TelaTransacoes.js** → Remover `aplicarFiltros()` e `ordenarTransacoes()`

### O que REMOVER (após backend pronto):
- ❌ **aplicarFiltros()** em `utilitariosTransacao.ts`
- ❌ **ordenarTransacoes()** em `utilitariosTransacao.ts`
- ❌ **Filtros/ordenação em memória** no componente

---

## 🚀 Plano de Implementação

### Fase 1: Desenvolvimento Backend (Sprint 1)
1. Criar endpoint `/api/transacoes` com suporte a query params
2. Implementar filtros no banco de dados (SQL WHERE clauses)
3. Implementar ordenação (SQL ORDER BY)
4. Implementar paginação (SQL LIMIT/OFFSET ou SKIP/TAKE)
5. Testar com Postman/Insomnia

### Fase 2: Integração Frontend (Sprint 2)
1. Atualizar `transacaoService.js` com `listarComFiltros()`
2. Testar endpoint com dados reais
3. Atualizar `useGerenciarTransacoes.ts` para usar novo serviço
4. Testar filtros, ordenação e paginação no app
5. Remover utilities de filtro/ordenação do frontend

### Fase 3: Otimizações (Sprint 3)
1. Adicionar cache de requisições (React Query ou SWR)
2. Implementar infinite scroll (se desejado)
3. Adicionar loading states melhores
4. Implementar retry automático em caso de erro
5. Adicionar analytics de uso de filtros

---

## 🔍 Exemplo Prático

### Usuário aplica filtros:
1. Usuário seleciona "Gastos" + "Categoria 1, 2" + "Últimos 30 dias"
2. UI chama: `setFiltros({ tipo: 'GASTO', categorias: [1, 2], dataInicio: '2024-01-01', dataFim: '2024-01-31', ... })`
3. `useEffect` detecta mudança em `filtros` e chama `carregarTransacoes()`
4. Hook constrói query: `/api/transacoes?tipo=GASTO&categorias=1,2&dataInicio=2024-01-01&dataFim=2024-01-31`
5. Backend processa filtros no banco de dados
6. Backend retorna apenas 15 transações que atendem aos critérios
7. Frontend renderiza 15 itens (não 1000+ itens filtrados)

### Benefícios:
- ⚡ **Menos dados trafegados** (15 itens vs 1000+)
- ⚡ **Renderização mais rápida** (menos itens no array)
- ⚡ **Escalável** (funciona com milhões de transações no banco)
- ⚡ **Menos memória usada** no dispositivo mobile

---

## 🛠️ Ferramentas Recomendadas

### Para Backend (Node.js/Express):
- **Validação**: `joi` ou `express-validator`
- **Query Builder**: `knex.js` ou ORM como `Sequelize`/`TypeORM`
- **Paginação**: biblioteca `paginate` ou implementação manual

### Para Frontend:
- **Cache e Sincronização**: `@tanstack/react-query` ou `swr`
- **Infinite Scroll**: `react-native-infinite-scroll` ou FlatList nativo
- **Debounce**: `lodash.debounce` para search

---

## 💡 Dicas de Performance

1. **Índices no Banco**: Criar índices em campos filtráveis (`tipo`, `data_transacao`, `fk_categoria`, etc.)
2. **Debounce no Search**: Esperar 300ms antes de enviar requisição de busca
3. **Cache de Filtros**: Armazenar combinações frequentes em cache
4. **Pagination Default**: Sempre retornar máximo de 50 itens por requisição
5. **Compressão**: Usar GZIP para comprimir respostas da API

---

## 📚 Referências

- [REST API Best Practices](https://restfulapi.net/)
- [JSON API Specification](https://jsonapi.org/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Express Query Parameters](https://expressjs.com/en/api.html#req.query)

---

**Mantenha este documento atualizado conforme a implementação avança!** 🚀
