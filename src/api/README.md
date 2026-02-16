# 📡 API - Serviços de Conexão

Estrutura de serviços para conexão com a API usando Axios.

## 📁 Estrutura

```
src/api/
├── config.js                      # Configuração base do Axios
├── index.js                       # Exportação centralizada
└── services/
    ├── usuarioService.js          # Serviços de usuários
    ├── categoriaService.js        # Serviços de categorias
    ├── instituicaoService.js      # Serviços de instituições
    ├── transacaoService.js        # Serviços de transações
    └── metaGastoService.js        # Serviços de metas de gasto
```

## 🚀 Como Usar

### Importação

```javascript
// Importar serviços específicos
import { transacaoService, instituicaoService } from '../api';

// Ou importar a instância do axios configurada
import { api } from '../api';
```

### Exemplos de Uso

#### Listar Transações

```javascript
import { transacaoService } from '../api';

const carregarTransacoes = async () => {
  try {
    const transacoes = await transacaoService.listar();
    console.log(transacoes);
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
  }
};
```

#### Criar Nova Transação

```javascript
import { transacaoService } from '../api';

const criarTransacao = async () => {
  try {
    const novaTransacao = {
      valor: 50.00,
      tipo: 'GASTO',
      descricao: 'Almoço',
      data_transacao: new Date().toISOString(),
      parcelado: false,
      recorrencia: null,
      fim_recorrencia: null,
      fk_instituicao: 1,
      fk_categoria: 1
    };
    
    const transacao = await transacaoService.criar(novaTransacao);
    console.log('Transação criada:', transacao);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
  }
};
```

#### Atualizar Instituição

```javascript
import { instituicaoService } from '../api';

const atualizarInstituicao = async (id) => {
  try {
    const dadosAtualizados = {
      nome: 'Nubank Atualizado',
      icone: 'credit-card',
      cor: '#8A05BE',
      fk_usuario: 1
    };
    
    const instituicao = await instituicaoService.atualizar(id, dadosAtualizados);
    console.log('Instituição atualizada:', instituicao);
  } catch (error) {
    console.error('Erro ao atualizar instituição:', error);
  }
};
```

#### Deletar Categoria

```javascript
import { categoriaService } from '../api';

const deletarCategoria = async (id) => {
  try {
    await categoriaService.deletar(id);
    console.log('Categoria deletada com sucesso');
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
  }
};
```

#### Buscar Transações por Período

```javascript
import { transacaoService } from '../api';

const buscarTransacoesMes = async () => {
  try {
    const dataInicio = '2026-02-01T00:00:00';
    const dataFim = '2026-02-28T23:59:59';
    
    const transacoes = await transacaoService.listarPorPeriodo(
      dataInicio, 
      dataFim
    );
    console.log('Transações do mês:', transacoes);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
  }
};
```

## 🔧 Configuração

### URL da API

A URL base é configurada automaticamente em [config.js](config.js):

- **iOS Simulator**: `http://localhost:3001`
- **Android Emulator**: `http://10.0.2.2:3001`
- **Produção**: Configurar URL real da API

### Timeout

Timeout padrão: 10 segundos. Para alterar, edite [config.js](config.js):

```javascript
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000, // 15 segundos
  // ...
});
```

### Autenticação

Para adicionar token de autenticação, descomente e configure o interceptor em [config.js](config.js):

```javascript
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

## 📋 Métodos Disponíveis

### Usuario Service

- `listar()` - Lista todos os usuários
- `buscarPorId(id)` - Busca usuário por ID
- `buscarPorEmail(email)` - Busca usuário por email
- `criar(usuario)` - Cria novo usuário
- `atualizar(id, usuario)` - Atualiza usuário
- `atualizarParcial(id, dados)` - Atualização parcial
- `deletar(id)` - Deleta usuário

### Categoria Service

- `listar()` - Lista todas as categorias
- `listarPorUsuario(usuarioId)` - Lista por usuário
- `buscarPorId(id)` - Busca por ID
- `criar(categoria)` - Cria nova categoria
- `atualizar(id, categoria)` - Atualiza categoria
- `deletar(id)` - Deleta categoria

### Instituicao Service

- `listar()` - Lista todas as instituições
- `listarPorUsuario(usuarioId)` - Lista por usuário
- `buscarPorId(id)` - Busca por ID
- `criar(instituicao)` - Cria nova instituição
- `atualizar(id, instituicao)` - Atualiza instituição
- `deletar(id)` - Deleta instituição
- `listarComTransacoes(usuarioId)` - Lista com transações

### Transacao Service

- `listar()` - Lista todas as transações
- `buscarPorId(id)` - Busca por ID
- `listarPorInstituicao(instituicaoId)` - Lista por instituição
- `listarPorCategoria(categoriaId)` - Lista por categoria
- `listarPorTipo(tipo)` - Lista por tipo (GASTO/RECEITA)
- `listarPorPeriodo(inicio, fim)` - Lista por período
- `listarRecorrentes()` - Lista recorrentes
- `criar(transacao)` - Cria nova transação
- `atualizar(id, transacao)` - Atualiza transação
- `deletar(id)` - Deleta transação
- `listarComPaginacao(pagina, limite)` - Lista com paginação

### MetaGasto Service

- `listar()` - Lista todas as metas
- `listarPorUsuario(usuarioId)` - Lista por usuário
- `buscarPorId(id)` - Busca por ID
- `buscarPorCategoria(categoriaId)` - Busca por categoria
- `listarAtivas(usuarioId, data)` - Lista metas ativas
- `criar(meta)` - Cria nova meta
- `atualizar(id, meta)` - Atualiza meta
- `deletar(id)` - Deleta meta

## 🔍 Tratamento de Erros

Os erros são tratados automaticamente pelos interceptors. Exemplo de uso com try/catch:

```javascript
try {
  const transacoes = await transacaoService.listar();
  // Sucesso
} catch (error) {
  if (error.response) {
    // Erro da API
    console.error('Status:', error.response.status);
    console.error('Dados:', error.response.data);
  } else if (error.request) {
    // Erro de rede
    console.error('Sem resposta do servidor');
  } else {
    // Outro erro
    console.error('Erro:', error.message);
  }
}
```

## 📦 Dependências

- **axios**: ^1.7.9
