# 💰 ContaDin - Aplicativo de Gestão Financeira

Aplicativo React Native/Expo para gerenciamento de finanças pessoais com controle de carteiras, transações, categorias e metas de gastos.

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Configuração](#-configuração)
- [Como Executar](#-como-executar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Testar](#-como-testar)
- [API e Serviços](#-api-e-serviços)
- [Troubleshooting](#-troubleshooting)

## 🔧 Pré-requisitos

- **Node.js** 18.18+ ou **20 LTS** (recomendado para Expo SDK 54)
- **npm** ou **yarn**
- **Expo Go** no celular **ou** emulador Android/iOS (Android Studio / Xcode)
- **Backend principal** rodando (porta padrão `8080`) — API Java/Spring do ContaDin
- **Serviço Python (ETL/IA)** rodando (porta padrão `8000`) — necessário para OCR, áudio e importação de planilha

> Não é necessário instalar `expo-cli` globalmente. O projeto já inclui o Expo localmente; use `npm start` ou `npx expo start`.

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo. Use o exemplo como base:

```bash
cp .env.example .env
# Edite .env com os valores do seu ambiente
```

| Variável | Descrição |
|----------|-----------|
| `EXPO_PUBLIC_API_BASE_URL` | URL base da API principal (ex.: `http://192.168.15.13:8080` ou `http://localhost:8080` no browser) |
| `EXPO_PUBLIC_PYTHON_BASE_URL` | URL do serviço Python — OCR, áudio e ETL (ex.: `http://192.168.15.13:8000`) |
| `EXPO_PUBLIC_ETL_IMPORT_PATH` | Caminho do endpoint de importação de planilha (padrão: `/data/process`) |
| `EXPO_PUBLIC_ETL_SEND_AUTH` | Enviar token `Authorization` nas requisições ao ETL (`true`/`false`; padrão `false`) |
| `EXPO_PUBLIC_SYSADMIN_EMAIL` | E-mail para login mockado (desenvolvimento) |
| `EXPO_PUBLIC_SYSADMIN_PASSWORD` | Senha para login mockado (desenvolvimento) |

**Comportamento por plataforma:**

- **Web (browser):** se `EXPO_PUBLIC_*` não estiver definida, o app usa fallback `http://localhost:8080` (API) e `http://localhost:8000` (Python).
- **Emulador ou dispositivo físico:** as URLs com IP da máquina são **obrigatórias** — `localhost` no celular aponta para o próprio aparelho, não para o seu PC.

Para descobrir o IP da máquina na rede local:

- **Windows:** `ipconfig`
- **Linux/macOS:** `ip addr` ou `ifconfig`

Após alterar o `.env`, reinicie o Expo (de preferência limpando cache):

```bash
npx expo start -c
```

## 🚀 Como Executar

**1. Clonar o repositório**

```bash
git clone https://github.com/ContaDin-Brasil/contadin-frontend
cd contadin-frontend
```

**2. Instalar dependências**

```bash
npm install
```

**3. Configurar variáveis de ambiente**

```bash
cp .env.example .env
# Editar .env — veja a tabela na seção Configuração
```

**4. Subir os backends (em terminais separados)**

- API principal na porta `8080`
- Serviço Python na porta `8000` — suba com `uvicorn app.main:app --reload --host 0.0.0.0` no repositório do backend Python

**5. Iniciar o aplicativo**

```bash
npm start
```

Quando o Metro Bundler abrir:

- `i` — iOS Simulator
- `a` — Android Emulator
- Escaneie o QR Code com o **Expo Go** — dispositivo físico

Alternativas:

```bash
npm run android
npm run ios
npm run web
```

> **Atenção — acesso via dispositivo físico ou emulador mobile**
>
> No `.env`, use o **IP da sua máquina na rede local**, não `localhost`:
>
> ```env
> EXPO_PUBLIC_API_BASE_URL=http://192.168.X.X:8080
> EXPO_PUBLIC_PYTHON_BASE_URL=http://192.168.X.X:8000
> ```
>
> O serviço Python precisa escutar em todas as interfaces (`--host 0.0.0.0`). Sem isso, funções de câmera, galeria, áudio e importação de planilha podem falhar silenciosamente ou retornar erro de rede.

## 📁 Estrutura do Projeto

```
TestesFinance/
├── assets/
│   └── logos/
│       └── instituicoes/          # Logos de bancos e vales (18 PNGs)
├── src/
│   ├── api/                       # Camada de serviços API
│   │   ├── config.ts              # Configuração do Axios e URL base
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
│       ├── TelaCategorias.jsx
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
- **i18next** - Internacionalização
- **React Native Vector Icons** - Ícones
- **React Native Gesture Handler** - Gestos e animações

## 🧪 Como Testar

### Teste Rápido de Conexão

1. Com o backend principal rodando, acesse no navegador (ajuste a URL conforme seu `.env`):
```
http://localhost:8080/instituicao
```

Você deve receber uma resposta da API com as instituições cadastradas.

2. Com o serviço Python rodando, acesse a documentação interativa:
```
http://localhost:8000/docs
```

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
curl -X POST http://localhost:8080/instituicao \
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
curl "http://localhost:8080/transacao?data_transacao_gte=2026-02-01&data_transacao_lte=2026-02-28"
```

**Filtrar instituições por tipo:**
```bash
curl "http://localhost:8080/instituicao?tipoInstituicao=banco"
```

## 📡 API e Serviços

### Configuração Base

As URLs dos serviços são lidas do `.env` via variáveis `EXPO_PUBLIC_*`:

- **API principal:** [src/api/config.ts](src/api/config.ts) — `EXPO_PUBLIC_API_BASE_URL`
- **Python (OCR, áudio, ETL):** [src/api/services/ocrService.ts](src/api/services/ocrService.ts), [src/api/services/importacaoPlanilhaService.ts](src/api/services/importacaoPlanilhaService.ts) — `EXPO_PUBLIC_PYTHON_BASE_URL`

| Ambiente | API (`8080`) | Python (`8000`) |
|----------|--------------|-----------------|
| **Web (browser)** | Fallback `http://localhost:8080` | Fallback `http://localhost:8000` |
| **Emulador / dispositivo físico** | IP da máquina no `.env` (obrigatório) | IP da máquina no `.env` (obrigatório) |

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

### Mock Server (legado)

A pasta `mock-server/` contém um JSON Server local usado em desenvolvimento anterior. O fluxo principal do app aponta para a API na porta `8080`. Consulte [mock-server/README.md](mock-server/README.md) se precisar usá-lo.

### Atualização Automática de Dados

O projeto implementa atualização automática de dados através de:

1. **useFocusEffect**: Recarrega dados ao focar na tela
2. **Reload após operações**: CRUD operations automaticamente atualizam a lista

Isso garante que:
- Ao navegar entre telas, os dados são sempre atualizados
- Ao adicionar/deletar items, a UI reflete imediatamente

## 🐛 Troubleshooting

### Erro de Conexão "Network Error"

**Problema**: App não consegue conectar à API ou ao serviço Python

**Soluções**:
1. Verifique se o backend principal está rodando na porta `8080`
2. Verifique se o serviço Python está rodando na porta `8000`
3. **Emulador ou dispositivo físico**: defina `EXPO_PUBLIC_API_BASE_URL` e `EXPO_PUBLIC_PYTHON_BASE_URL` com o IP da sua máquina no `.env` — `localhost` não funciona nesses ambientes
4. Reinicie o Expo após alterar o `.env`: `npx expo start -c`
5. Verifique o firewall — permita conexões nas portas `8080` e `8000`

### OCR, áudio ou importação de planilha não funcionam

**Problema**: Funcionalidades de IA não respondem ou não geram logs no backend Python

**Soluções**:
1. Confirme que `EXPO_PUBLIC_PYTHON_BASE_URL` aponta para o IP correto da máquina
2. Suba o Python com `--host 0.0.0.0` para expor o serviço na rede local
3. Dispositivo e computador devem estar na mesma rede Wi-Fi

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
4. Limpe o cache: `npx expo start -c`

### Erro "Cannot find module"

**Problema**: Erros de importação de módulos

**Soluções**:
1. Execute `npm install` na raiz do projeto
2. Limpe o cache do Metro: `npx expo start -c`
3. Delete `node_modules` e reinstale

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
