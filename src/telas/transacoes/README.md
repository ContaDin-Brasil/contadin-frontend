# Módulo de Transações

Arquivos organizados seguindo boas práticas de separação de responsabilidades, utilizando TypeScript para melhor controle de tipos.

## 📁 Estrutura de Arquivos

```
src/telas/transacoes/
├── types/
│   └── transacao.types.ts           # Definições de tipos TypeScript
├── constants/
│   └── constantesTransacao.ts       # Constantes e dados mock
├── utils/
│   └── utilitariosTransacao.ts      # Funções utilitárias (formatação, agrupamento)
├── hooks/
│   ├── useProcessamentoIA.ts        # Hook para processamento de IA/OCR
│   └── useFormularioTransacao.ts    # Hook para gerenciar formulário
├── styles/
│   ├── TelaAdicionarTransacao.styles.js  # Estilos da tela de adicionar
│   └── TelaTransacoes.styles.js          # Estilos da tela de lista
├── TelaTransacoes.js                # Componente de lista de transações
└── TelaAdicionarTransacao.js        # Componente de adicionar transação
```

## 🎯 Benefícios desta Organização

### 1. **Separação de Responsabilidades**
- Cada arquivo tem uma responsabilidade única e bem definida
- Facilita manutenção e testes

### 2. **Reutilização de Código**
- Hooks customizados podem ser reutilizados em outros componentes
- Funções utilitárias centralizadas

### 3. **Type Safety com TypeScript**
- Tipos bem definidos previnem erros em tempo de desenvolvimento
- Autocomplete e IntelliSense aprimorados

### 4. **Arquivos Menores e Mais Legíveis**
- Componentes React ficam focados apenas na UI
- Lógica de negócio separada da apresentação

### 5. **Fácil Manutenção e Escalabilidade**
- Adicionar nova funcionalidade não incha os componentes
- Modificar lógica não afeta outros arquivos

## 📝 Descrição dos Arquivos

### **types/transacao.types.ts**
Define todos os tipos TypeScript usados no módulo:
- `TransactionType`, `InstitutionType`, `FrequencyType`
- Interfaces: `Transaction`, `Institution`, `Category`, `AISuggestion`, etc.

### **constants/constantesTransacao.ts**
Armazena dados estáticos:
- `CATEGORIES`: Lista de categorias disponíveis
- `FREQUENCIES`: Opções de recorrência
- `DEFAULT_INSTITUTIONS`: Instituições padrão
- `MOCK_TRANSACTIONS`: Dados de exemplo

### **utils/utilitariosTransacao.ts**
Funções utilitárias puras:
- `formatCurrency()`: Formata valores monetários
- `formatDateLabel()`: Formata labels de data
- `groupTransactionsByDate()`: Agrupa transações por data
- `isTransactionValid()`: Valida dados da transação

### **hooks/useProcessamentoIA.ts**
Hook customizado para IA/OCR:
- Gerencia estado de processamento
- Controla animação de loading
- Simula processamento de foto/áudio
- Retorna sugestões da IA

### **hooks/useFormularioTransacao.ts**
Hook customizado para o formulário:
- Gerencia todos os estados do formulário
- Centraliza lógica de negócio
- Fornece ações (setters, aplicar sugestão, etc.)
- Permite resetar formulário

### **TelaTransacoes.js**
Componente de lista:
- ~150 linhas (antes eram ~273)
- Usa `groupTransactionsByDate` e `formatCurrency` dos utils
- Usa `MOCK_TRANSACTIONS` das constants
- Estilos separados em `styles/TelaTransacoes.styles.js`

### **TelaAdicionarTransacao.js**
Componente de formulário:
- ~360 linhas (antes eram ~763)
- Usa hooks `useFormularioTransacao` e `useProcessamentoIA`
- Usa `CATEGORIES` e `FREQUENCIES` das constants
- Estilos separados em `styles/TelaAdicionarTransacao.styles.js`

## 🚀 Como Usar

### Importando Types
```typescript
import { Transaction, TransactionType } from './types/transacao.types';
```

### Usando Utils
```typescript
import { formatCurrency, groupTransactionsByDate } from './utils/utilitariosTransacao';

const formatted = formatCurrency(145.80); // "-R$ 145,80"
const grouped = groupTransactionsByDate(transactions);
```

### Usando Hooks
```typescript
import { useFormularioTransacao } from './hooks/useFormularioTransacao';
import { useProcessamentoIA } from './hooks/useProcessamentoIA';

const formState = useFormularioTransacao();
const aiState = useProcessamentoIA();

// Acessar estado
console.log(formState.description);

// Usar ações
formState.setDescription('Nova descrição');
aiState.handlePhotoOCR();
```

### Usando Constants
```typescript
import { CATEGORIES, FREQUENCIES } from './constants/constantesTransacao';

CATEGORIES.map(cat => <Button>{cat.name}</Button>);
```

## 🔄 Próximos Passos

Para estender esta organização para outras pastas:
1. Crie estrutura similar em `src/telas/carteira/`
2. Crie estrutura similar em `src/telas/configuracoes/`
3. Considere criar um `src/shared/` para código compartilhado entre módulos

## 📊 Métricas

| Antes | Depois |
|-------|--------|
| 2 arquivos grandes | 7 arquivos organizados |
| ~1050 linhas total | ~1050 linhas total (melhor distribuídas) |
| Difícil manutenção | Fácil manutenção |
| Sem tipagem | TypeScript nos utilitários |
| Lógica misturada | Separação clara de responsabilidades |
