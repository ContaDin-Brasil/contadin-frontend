# Mock Server - Simulação de Banco de Dados

Este diretório contém a configuração de um servidor JSON Server para simular o banco de dados durante o desenvolvimento, permitindo testes reais de operações CRUD (Create, Read, Update, Delete) enquanto o backend real está sendo desenvolvido.

## 📋 Pré-requisitos

- Node.js instalado
- npm ou yarn

## 🚀 Instalação

1. Navegue até a pasta do mock-server:
```bash
cd mock-server
```

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como Iniciar o Servidor

### Modo básico
```bash
npm start
```
O servidor será iniciado em `http://localhost:3001`

### Com atraso simulado (para testar loading states)
```bash
npm run start:delay
```
Adiciona um atraso de 500ms em todas as requisições

### Acessível na rede local (para testar em dispositivos móveis)
```bash
npm run start:host
```

## 📚 Estrutura do Banco de Dados

O banco de dados simulado possui as seguintes entidades:

- **usuario** - Usuários do sistema
- **token_recuperar_senha** - Tokens para recuperação de senha
- **categoria** - Categorias de transações
- **instituicao** - Bancos, carteiras e vales
- **transacao** - Transações financeiras (gastos e receitas)
- **meta_gasto** - Metas de gastos por categoria

## 🔌 Endpoints Disponíveis

### Usuários
```
GET    /usuario          - Lista todos os usuários
GET    /usuario/1        - Busca usuário por ID
POST   /usuario          - Cria novo usuário
PUT    /usuario/1        - Atualiza usuário
PATCH  /usuario/1        - Atualiza parcialmente
DELETE /usuario/1        - Deleta usuário
```

### Categorias
```
GET    /categoria        - Lista todas as categorias
GET    /categoria/1      - Busca categoria por ID
POST   /categoria        - Cria nova categoria
PUT    /categoria/1      - Atualiza categoria
DELETE /categoria/1      - Deleta categoria
```

### Instituições
```
GET    /instituicao      - Lista todas as instituições
GET    /instituicao/1    - Busca instituição por ID
POST   /instituicao      - Cria nova instituição
PUT    /instituicao/1    - Atualiza instituição
DELETE /instituicao/1    - Deleta instituição
```

### Transações
```
GET    /transacao        - Lista todas as transações
GET    /transacao/1      - Busca transação por ID
POST   /transacao        - Cria nova transação
PUT    /transacao/1      - Atualiza transação
DELETE /transacao/1      - Deleta transação
```

### Metas de Gasto
```
GET    /meta_gasto       - Lista todas as metas
GET    /meta_gasto/1     - Busca meta por ID
POST   /meta_gasto       - Cria nova meta
PUT    /meta_gasto/1     - Atualiza meta
DELETE /meta_gasto/1     - Deleta meta
```

## 🔍 Filtros e Consultas Avançadas

O JSON Server suporta diversos tipos de consultas:

### Filtrar por campo
```
GET /transacao?tipo=GASTO
GET /transacao?fk_usuario=1
GET /instituicao?fk_usuario=1
```

### Filtrar múltiplos valores
```
GET /categoria?fk_usuario=1&fk_usuario=2
```

### Paginação
```
GET /transacao?_page=1&_limit=10
```

### Ordenação
```
GET /transacao?_sort=data_transacao&_order=desc
GET /categoria?_sort=nome&_order=asc
```

### Busca em texto
```
GET /transacao?q=supermercado
```

### Operadores
```
GET /transacao?valor_gte=100           # maior ou igual
GET /transacao?valor_lte=500           # menor ou igual
GET /transacao?valor_ne=0              # diferente
```

### Relacionamentos (expansão)
```
GET /transacao?_expand=categoria
GET /transacao?_expand=instituicao
GET /transacao/1?_embed=categoria&_embed=instituicao
```

### Range
```
GET /transacao?data_transacao_gte=2026-02-01&data_transacao_lte=2026-02-28
```

## 💡 Exemplos de Uso

### Criar uma nova transação
```bash
curl -X POST http://localhost:3001/transacao \
  -H "Content-Type: application/json" \
  -d '{
    "valor": 45.90,
    "tipo": "GASTO",
    "descricao": "Restaurante",
    "data_transacao": "2026-02-15T12:30:00",
    "parcelado": false,
    "recorrencia": null,
    "fim_recorrencia": null,
    "fk_instituicao": 2,
    "fk_categoria": 1
  }'
```

### Atualizar uma instituição
```bash
curl -X PUT http://localhost:3001/instituicao/1 \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "nome": "Banco do Brasil Atualizado",
    "icone": "bank",
    "cor": "#FFDD00",
    "fk_usuario": 1
  }'
```

### Deletar uma categoria
```bash
curl -X DELETE http://localhost:3001/categoria/1
```

### Buscar transações por usuário (através de instituição)
```bash
curl http://localhost:3001/transacao?fk_instituicao=1
```

## 📱 Integração com React Native

No seu código React Native, configure a URL base da API:

```javascript
// Para emulador Android
const API_URL = 'http://10.0.2.2:3001';

// Para dispositivo físico na mesma rede
const API_URL = 'http://SEU_IP_LOCAL:3001';

// Para iOS Simulator
const API_URL = 'http://localhost:3001';

// Exemplo de uso com fetch
const buscarTransacoes = async () => {
  try {
    const response = await fetch(`${API_URL}/transacao?fk_usuario=1`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
  }
};

const criarTransacao = async (transacao) => {
  try {
    const response = await fetch(`${API_URL}/transacao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transacao),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar transação:', error);
  }
};
```

## 🎯 Tipos de Dados

### Enums importantes:

**Tipo de Transação:**
- `GASTO`
- `RECEITA`

**Recorrência:**
- `DIARIO`
- `SEMANAL`
- `MENSAL`
- `ANUAL`
- `null` (para transações não recorrentes)

## 📝 Notas Importantes

1. **Persistência**: Todas as alterações são salvas automaticamente no arquivo `db.json`
2. **IDs**: São gerados automaticamente pelo JSON Server
3. **Reset**: Para resetar os dados, basta restaurar o `db.json` original
4. **Backup**: Faça backup do `db.json` antes de fazer testes destrutivos

## 🔧 Configurações Adicionais

### Alterar a porta
Edite o script no `package.json`:
```json
"start": "json-server --watch db.json --port 3002"
```

### Adicionar middlewares customizados
Crie um arquivo `middleware.js` e configure no servidor.

### Habilitar CORS
Por padrão, o JSON Server já tem CORS habilitado para todas as origens.

## 🆘 Troubleshooting

### Porta em uso
Se a porta 3001 estiver em uso, altere no script ou encerre o processo:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill
```

### Não consegue acessar do dispositivo móvel
1. Certifique-se de que está na mesma rede Wi-Fi
2. Verifique o firewall do Windows
3. Use `npm run start:host` em vez de `npm start`
4. Descubra seu IP local: `ipconfig` (Windows) ou `ifconfig` (Linux/Mac)

## 📚 Documentação Adicional

Para mais informações sobre o JSON Server:
- [JSON Server - GitHub](https://github.com/typicode/json-server)
- [JSON Server - NPM](https://www.npmjs.com/package/json-server)
