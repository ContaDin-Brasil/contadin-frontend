# 💰 ContaDin - Aplicativo de Gestão Financeira

Aplicativo React Native/Expo para gerenciamento de finanças pessoais com controle de carteiras, transações, categorias e metas de gastos.

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Como Executar](#-como-executar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Testar](#-como-testar)
- [API e Mock Server](#-api-e-mock-server)
- [Troubleshooting](#-troubleshooting)

## 🔧 Pré-requisitos

- **Node.js** (v14 ou superior)
- **npm** ou **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Emulador Android/iOS** ou **Expo Go** no dispositivo móvel

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/ContaDin-Brasil/contadin-frontend
cd contadin-frontend
```

2. Instale as dependências do projeto:
```bash
npm install
```

3. Instale as dependências do Mock Server:
```bash
cd mock-server
npm install
cd ..
```

## 🚀 Como Executar

### 1. Inicie o Mock Server

O Mock Server simula um backend real e precisa estar rodando antes de iniciar o aplicativo.

**Windows:**
```bash
cd mock-server
npm start
```

**Linux/Mac:**
```bash
cd mock-server
npm start
```

O servidor será iniciado em: `http://localhost:3001`

### 2. Inicie o Aplicativo

Em outro terminal (na raiz do projeto):

```bash
npm start
```

Aguarde o Metro Bundler iniciar e então:
- Pressione `i` para iOS Simulator
- Pressione `a` para Android Emulator
- Escaneie o QR Code com o **Expo Go** para testar em dispositivo físico

### 3. Configuração de IP para Dispositivos Físicos

Se estiver testando em um dispositivo físico Android, edite o arquivo [src/api/config.js](src/api/config.js) e substitua o IP:

```javascript
// Substitua pelo IP da sua máquina na rede local
const API_BASE_URL = 'http://192.168.x.x:3001';
```

Para descobrir seu IP:
- **Windows**: `ipconfig`
- **Linux/Mac**: `ifconfig` ou `ip addr`

## 📁 Estrutura do Projeto

```
TestesFinance/
├── assets/
│   └── logos/
│       └── instituicoes/          # Logos de bancos e vales (18 PNGs)
├── src/
│   ├── api/                       # Camada de serviços API
│   │   ├── config.js              # Configuração do Axios
│   │   └── services/              # Serviços por recurso
│   │       ├── usuarioService.js
│   │       ├── categoriaService.js
│   │       ├── instituicaoService.js
│   │       ├── transacaoService.js
│   │       └── metaGastoService.js
│   ├── componentes/
│   │   ├── BotaoCustomizado.js
│   │   ├── cartoes/
│   │   │   └── CartaoInstituicao.js
│   │   └── modais/
│   │       ├── ModalBase.js
│   │       ├── ModalAdicionarInstituicao.js
│   │       └── ModalSelecaoInstituicao.js
│   ├── navegacao/
│   │   └── NavegadorPrincipal.js
│   └── telas/
│       ├── TelaInicial.js
│       ├── TelaCategorias.js
│       ├── carteira/              # Módulo de Carteiras
│       │   ├── TelaCarteira.js
│       │   ├── TelaEditarBancos.js
│       │   ├── TelaEditarVales.js
│       │   ├── hooks/
│       │   │   ├── useGerenciarCarteira.ts
│       │   │   └── useEditarInstituicoes.ts
│       │   ├── types/
│       │   │   └── carteira.types.ts
│       │   ├── constants/
│       │   │   └── constantesCarteira.ts
│       │   └── styles/
│       ├── transacoes/            # Módulo de Transações
│       │   ├── TelaTransacoes.js
│       │   ├── TelaAdicionarTransacao.js
│       │   ├── hooks/
│       │   │   ├── useFormularioTransacao.ts
│       │   │   └── useProcessamentoIA.ts
│       │   ├── types/
│       │   │   └── transacao.types.ts
│       │   ├── constants/
│       │   │   └── constantesTransacao.ts
│       │   ├── utils/
│       │   │   └── utilitariosTransacao.ts
│       │   └── styles/
│       └── configuracoes/         # Módulo de Configurações
│           ├── TelaConfiguracoes.js
│           ├── TelaEditarPerfil.js
│           ├── TelaConta.js
│           ├── TelaAlterarSenha.js
│           ├── TelaAjuda.js
│           ├── hooks/
│           │   ├── useEditarPerfil.ts
│           │   ├── useGerenciarConta.ts
│           │   ├── useAlterarSenha.ts
│           │   └── useAjuda.ts
│           ├── types/
│           │   └── configuracoes.types.ts
│           ├── constants/
│           │   └── constantesConfiguracao.ts
│           └── styles/
├── mock-server/
│   ├── db.json                    # Banco de dados simulado
│   ├── package.json
│   └── server.js                  # Configuração do JSON Server
├── App.js
├── package.json
└── tsconfig.json
```

## ✨ Funcionalidades

### 🏦 Carteira (Instituições)
- ✅ Visualização de bancos e vales em grid
- ✅ Adicionar instituições predefinidas (18 logos disponíveis)
- ✅ Criar instituições customizadas
- ✅ Editar instituições existentes
- ✅ Deletar instituições
- ✅ Filtro automático (exibe apenas instituições não selecionadas)
- ✅ Logos reais de bancos e vales (Nubank, Santander, Itaú, Inter, etc.)

### 💸 Transações
- ✅ Listar transações agrupadas por data
- ✅ Adicionar gastos e receitas
- ✅ Categorização de transações
- ✅ Suporte a parcelamento
- ✅ Transações recorrentes (diária, semanal, mensal)
- ✅ Relacionamento com instituições
- ✅ Processamento simulado de IA/OCR (foto/áudio)

### 🏷️ Categorias
- ✅ Categorias predefinidas (Alimentação, Transporte, Lazer, etc.)
- ✅ Gerenciamento de categorias por usuário

### ⚙️ Configurações
- ✅ Editar perfil do usuário
- ✅ Alterar senha com validação (8+ caracteres, maiúscula, minúscula, número, especial)
- ✅ Gerenciar conta (processo de exclusão em 3 etapas)
- ✅ Tela de ajuda com FAQ e contato
- ✅ Suporte a tema escuro e notificações push

### 🎯 Metas de Gasto
- ✅ Definir metas por categoria
- ✅ Acompanhar progresso das metas

## 🛠️ Tecnologias Utilizadas

- **React Native** com **Expo**
- **TypeScript** - Para hooks e tipos
- **React Navigation** - Navegação entre telas
- **Axios** - Requisições HTTP
- **JSON Server** - Mock backend
- **React Native Vector Icons** - Ícones
- **React Native Gesture Handler** - Gestos e animações

## 🧪 Como Testar

### Teste Rápido de Conexão

1. Com o Mock Server rodando, acesse no navegador:
```
http://localhost:3001/instituicao
```

Você deve ver um JSON com as instituições cadastradas.

### Teste no Aplicativo

1. **Teste de Carteira:**
   - Navegue para "Carteira"
   - Toque em "Editar Bancos" ou "Editar Vales"
   - Adicione um banco/vale predefinido
   - Volte para tela principal → O item deve aparecer
   - Delete um item → Volte para tela principal → O item deve desaparecer

2. **Teste de Transações:**
   - Navegue para "Transações"
   - Toque no botão "+" para adicionar
   - Preencha os campos e salve
   - Verifique se a transação aparece na lista

3. **Teste de Filtros:**
   - Adicione vários bancos
   - Volte ao modal de seleção
   - Os bancos já adicionados não devem aparecer mais

### Endpoints da API

| Recurso | Método | Endpoint |
|---------|--------|----------|
| Listar Instituições | GET | `/instituicao` |
| Criar Instituição | POST | `/instituicao` |
| Atualizar Instituição | PUT | `/instituicao/:id` |
| Deletar Instituição | DELETE | `/instituicao/:id` |
| Listar Transações | GET | `/transacao` |
| Criar Transação | POST | `/transacao` |
| Listar Categorias | GET | `/categoria` |

### Exemplos de Requisições

**Criar uma nova instituição:**
```bash
curl -X POST http://localhost:3001/instituicao \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Nubank",
    "icone": "credit-card",
    "cor": "#8A05BE",
    "tipoInstituicao": "banco",
    "fk_usuario": 1
  }'
```

**Listar transações por período:**
```bash
curl "http://localhost:3001/transacao?data_transacao_gte=2026-02-01&data_transacao_lte=2026-02-28"
```

**Filtrar instituições por tipo:**
```bash
curl "http://localhost:3001/instituicao?tipoInstituicao=banco"
```

## 📡 API e Mock Server

### Configuração Base

A URL da API é configurada automaticamente em [src/api/config.js](src/api/config.js):

- **iOS Simulator**: `http://localhost:3001`
- **Android Emulator**: `http://10.0.2.2:3001`
- **Dispositivo Físico**: Configurar IP manualmente

### Serviços Disponíveis

Todos os serviços estão em [src/api/services/](src/api/services/) e podem ser importados assim:

```javascript
import { transacaoService, instituicaoService, categoriaService } from '../api';

// Listar
const transacoes = await transacaoService.listar();

// Criar
const nova = await transacaoService.criar(dados);

// Atualizar
await transacaoService.atualizar(id, dados);

// Deletar
await transacaoService.deletar(id);
```

### Estrutura do Banco de Dados

O arquivo `mock-server/db.json` contém:

- **usuario** - Dados do usuário
- **categoria** - Categorias de transações
- **instituicao** - Bancos, carteiras e vales
- **transacao** - Gastos e receitas
- **meta_gasto** - Metas por categoria
- **token_recuperar_senha** - Tokens de recuperação

### Atualização Automática de Dados

O projeto implementa atualização automática de dados através de:

1. **useFocusEffect**: Recarrega dados ao focar na tela
2. **Reload após operações**: CRUD operations automaticamente atualizam a lista

Isso garante que:
- Ao navegar entre telas, os dados são sempre atualizados
- Ao adicionar/deletar items, a UI reflete imediatamente

## 🐛 Troubleshooting

### Erro de Conexão "Network Error"

**Problema**: App não consegue conectar ao Mock Server

**Soluções**:
1. Verifique se o Mock Server está rodando (`npm start` em `mock-server/`)
2. **Android Emulator**: Use `http://10.0.2.2:3001` em vez de `localhost`
3. **Dispositivo físico**: Configure o IP da sua máquina na rede local
4. Verifique o firewall - permita conexões na porta 3001

### Mock Server não inicia

**Problema**: Erro ao executar `npm start` no mock-server

**Soluções**:
1. Delete o `node_modules` e `package-lock.json`
2. Execute `npm install` novamente
3. Verifique se a porta 3001 está livre: `netstat -ano | findstr :3001` (Windows)
4. Se estiver ocupada, mate o processo ou mude a porta em `mock-server/package.json`

### Dados não atualizam após delete/create

**Problema**: Ao deletar/adicionar item, ele não some/aparece imediatamente

**Solução**: Este problema já foi resolvido! O projeto agora usa:
- `useFocusEffect` para recarregar ao entrar na tela
- Reload automático após operações CRUD

Se ainda ocorrer, verifique se está na versão mais recente do código.

### Logos não aparecem

**Problema**: Logos de instituições não são exibidas

**Soluções**:
1. Verifique se os arquivos PNG estão em `assets/logos/instituicoes/`
2. Nomes dos arquivos devem ser minúsculos e com hífens (ex: `banco-do-brasil.png`)
3. Reinicie o Metro Bundler: pressione `r` no terminal ou `Ctrl+C` e `npm start`
4. Limpe o cache: `expo start -c`

### Erro "Cannot find module"

**Problema**: Erros de importação de módulos

**Soluções**:
1. Execute `npm install` na raiz do projeto
2. Execute `npm install` dentro de `mock-server/`
3. Limpe o cache do Metro: `expo start -c`
4. Delete `node_modules` e reinstale

### App não carrega no dispositivo físico

**Problema**: Não consegue conectar ao Expo

**Soluções**:
1. Certifique-se de que dispositivo e computador estão na **mesma rede Wi-Fi**
2. Desabilite VPNs ou proxies
3. Use conexão via túnel: `expo start --tunnel`
4. Verifique permissões do firewall

### TypeScript Errors

**Problema**: Erros de tipo TypeScript

**Soluções**:
1. Verifique o arquivo `tsconfig.json`
2. Execute `npm install --save-dev @types/react @types/react-native`
3. Reinicie o VS Code
4. Os erros de tipo não impedem a execução - o app pode rodar mesmo com warnings

## 📝 Notas de Desenvolvimento

### Arquitetura

O projeto segue boas práticas de separação de responsabilidades:

- **Types**: Definições TypeScript para type-safety
- **Constants**: Dados estáticos e configurações
- **Hooks**: Lógica de negócio reutilizável
- **Utils**: Funções utilitárias puras
- **Styles**: Estilos separados dos componentes

### Padrões de Código

- Hooks customizados para gerenciar estado e lógica
- TypeScript para hooks e definições de tipos
- JavaScript para componentes React
- Estilos em arquivos `.styles.js` separados
- Serviços de API centralizados

### Próximos Passos

- [ ] Conectar a um backend real
- [ ] Implementar autenticação JWT
- [ ] Adicionar gráficos e relatórios
- [ ] Implementar sincronização offline
- [ ] Adicionar testes unitários
- [ ] Configurar CI/CD

## 📄 Licença

Este projeto é para fins educacionais e de desenvolvimento.

## 👥 Contato

Para dúvidas ou sugestões, entre em contato através do repositório.

---

**Desenvolvido com ❤️ usando React Native e Expo**
