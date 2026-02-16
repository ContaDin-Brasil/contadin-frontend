# 🚀 Guia Rápido - API

## Início Rápido

### 1️⃣ Certifique-se de que o Mock Server está rodando

```bash
cd mock-server
npm start
```

O servidor deve estar em: http://localhost:3001

### 2️⃣ Importe os serviços no seu componente

```javascript
import { transacaoService, instituicaoService } from '../api';
```

### 3️⃣ Use os métodos

```javascript
// Listar transações
const transacoes = await transacaoService.listar();

// Criar nova transação
const nova = await transacaoService.criar({
  valor: 50.00,
  tipo: 'GASTO',
  descricao: 'Almoço',
  data_transacao: new Date().toISOString(),
  parcelado: false,
  recorrencia: null,
  fim_recorrencia: null,
  fk_instituicao: 1,
  fk_categoria: 1
});

// Atualizar transação
const atualizada = await transacaoService.atualizar(1, dadosAtualizados);

// Deletar transação
await transacaoService.deletar(1);
```

## 📋 Serviços Disponíveis

- `usuarioService` - Gerenciamento de usuários
- `categoriaService` - Gerenciamento de categorias
- `instituicaoService` - Gerenciamento de instituições (bancos, vales, carteiras)
- `transacaoService` - Gerenciamento de transações (gastos e receitas)
- `metaGastoService` - Gerenciamento de metas de gastos

## 🧪 Testar a API

Use o arquivo de teste para verificar se tudo está funcionando:

```javascript
import { testarAPI, testarConexao } from '../api/teste';

// Teste rápido de conexão
await testarConexao();

// Teste completo (todos os serviços)
await testarAPI();
```

## 📱 Configuração por Plataforma

A URL já está configurada automaticamente em [config.js](config.js):

- **iOS**: `http://localhost:3001`
- **Android**: `http://10.0.2.2:3001`

Para dispositivo físico, edite manualmente a URL em [config.js](config.js).

## 📚 Documentação Completa

Veja [README.md](README.md) para documentação completa e mais exemplos.

## 📁 Arquivos Principais

- [config.js](config.js) - Configuração do Axios
- [constants.js](constants.js) - Constantes (tipos, enums)
- [index.js](index.js) - Exportações centralizadas
- [services/](services/) - Serviços por recurso
- [exemplos-uso.js](exemplos-uso.js) - Exemplos práticos em React Native
- [teste.js](teste.js) - Testes de conexão e funcionalidade

## ⚠️ Lembre-se

1. Mock server precisa estar rodando
2. Use try/catch para tratar erros
3. Os IDs são gerados automaticamente
4. Todas as alterações são salvas no db.json
