# 🎲 Gerador de Transações Mockadas

Utilitários para popular o banco de dados com transações de teste usando as instituições e categorias já cadastradas.

## 📋 Requisitos

- Node.js instalado
- Instituições cadastradas no banco de dados
- Categorias cadastradas no banco de dados

## 🚀 Como Usar

### Windows

```bash
# Gerar 50 transações (padrão)
gerar-transacoes.bat

# Gerar quantidade específica
gerar-transacoes.bat 100

# Limpar todas as transações e gerar novas
gerar-transacoes.bat 30 limpar

# Ver estatísticas do banco
gerar-transacoes.bat stats

# Limpar todas as transações
gerar-transacoes.bat limpar
```

### Linux/Mac

```bash
# Dar permissão de execução (só precisa fazer uma vez)
chmod +x gerar-transacoes.sh

# Gerar 50 transações (padrão)
./gerar-transacoes.sh

# Gerar quantidade específica
./gerar-transacoes.sh 100

# Limpar todas as transações e gerar novas
./gerar-transacoes.sh 30 limpar

# Ver estatísticas do banco
./gerar-transacoes.sh stats

# Limpar todas as transações
./gerar-transacoes.sh limpar
```

### Usando Node diretamente

```bash
cd mock-server

# Gerar 50 transações
node utils/gerar-transacoes.js

# Gerar 100 transações
node utils/gerar-transacoes.js 100

# Limpar e gerar 30 novas
node utils/gerar-transacoes.js 30 limpar

# Ver estatísticas
node utils/gerar-transacoes.js stats

# Limpar tudo
node utils/gerar-transacoes.js limpar
```

## ⚙️ Configurações

O gerador cria transações com as seguintes características:

- **Período**: Transações dos últimos 90 dias
- **Tipos**: 25% receitas, 75% gastos
- **Parceladas**: 20% das transações
- **Recorrentes**: 15% das transações
- **Valores**:
  - Gastos: R$ 10 a R$ 800
  - Receitas: R$ 500 a R$ 8.000

### Personalizando

Para personalizar as configurações, edite o arquivo `utils/gerar-transacoes.js` e modifique o objeto `opcoes`:

```javascript
const opcoes = {
  diasAtras: 90,              // Período de geração (dias)
  percentualReceitas: 25,     // % de receitas
  percentualParcelado: 20,    // % de transações parceladas
  percentualRecorrente: 15,   // % de transações recorrentes
  valorMinGasto: 10,          // Valor mínimo de gasto
  valorMaxGasto: 800,         // Valor máximo de gasto
  valorMinReceita: 500,       // Valor mínimo de receita
  valorMaxReceita: 8000,      // Valor máximo de receita
};
```

## 📊 Tipos de Transações Geradas

### Receitas
- Salário
- Freelance
- Venda Online
- Cashback
- Reembolso
- Bonificação
- Dividendos
- Aluguel Recebido
- Prêmio
- Bônus

### Gastos
- Supermercado
- Restaurante
- Uber
- Combustível
- Farmácia
- Cinema
- Streaming (Netflix, Spotify)
- Academia
- Contas (Luz, Água, Internet, Celular)
- Padaria
- Delivery
- Estacionamento
- Saúde (Dentista, Médico)
- Educação (Cursos, Livros)
- Compras (Roupas, Sapatos)
- Presentes
- Pet Shop
- Serviços Pessoais (Barbeiro, Salão)
- E muito mais...

## 🔧 Módulo Mocker

O arquivo `utils/mocker.js` contém as funções principais que podem ser importadas em outros scripts:

### Funções Disponíveis

```javascript
const {
  gerarTransacoes,
  adicionarTransacoes,
  limparTransacoes,
  mostrarEstatisticas,
  lerDatabase,
  salvarDatabase,
} = require('./utils/mocker');

// Gerar transações
const transacoes = gerarTransacoes(50, opcoes);

// Adicionar ao banco
adicionarTransacoes(transacoes, limparExistentes);

// Limpar banco
limparTransacoes();

// Ver estatísticas
mostrarEstatisticas();

// Ler banco
const db = lerDatabase();

// Salvar banco
salvarDatabase(db);
```

## 📝 Exemplo de Uso Programático

```javascript
const { gerarTransacoes, adicionarTransacoes } = require('./utils/mocker');

// Configuração personalizada
const opcoes = {
  diasAtras: 30,
  percentualReceitas: 50,
  valorMinGasto: 5,
  valorMaxGasto: 200,
};

// Gera 20 transações
const transacoes = gerarTransacoes(20, opcoes);

// Adiciona ao banco sem remover existentes
adicionarTransacoes(transacoes, false);
```

### 🎓 Exemplos Práticos

O arquivo [exemplo-uso.js](exemplo-uso.js) contém 5 exemplos completos:

```bash
# Menu de exemplos
node utils/exemplo-uso.js

# Exemplo 1: Geração personalizada
node utils/exemplo-uso.js 1

# Exemplo 2: Transações de instituição específica
node utils/exemplo-uso.js 2 19  # ID 19 = Santander

# Exemplo 3: Criar cenário de teste
node utils/exemplo-uso.js 3

# Exemplo 4: Análise e relatórios
node utils/exemplo-uso.js 4

# Exemplo 5: Backup personalizado
node utils/exemplo-uso.js 5
```

**Exemplos incluem:**
1. 🎲 Geração com configurações personalizadas
2. 🏦 Transações de uma instituição específica
3. 🧪 Criar cenários de teste customizados
4. 📊 Análise e relatórios detalhados
5. 💾 Backup e restore com timestamp

## ⚠️ Avisos

- As transações geradas usam as instituições e categorias **já cadastradas** no banco
- Se não houver instituições ou categorias, o gerador não funcionará
- Use `limpar` com cuidado - remove **todas** as transações do banco
- As transações são geradas aleatoriamente e não representam dados reais

## 🆘 Solução de Problemas

### "Nenhuma instituição encontrada"
- Certifique-se de ter instituições cadastradas no banco
- Adicione instituições através do app antes de gerar transações

### "Nenhuma categoria encontrada"
- Certifique-se de ter categorias cadastradas
- Adicione categorias de receita e gasto através do app

### Script não executa no Linux/Mac
- Dê permissão de execução: `chmod +x gerar-transacoes.sh`
- Ou execute direto com: `bash gerar-transacoes.sh`

## 📄 Estrutura de Arquivos

```
mock-server/
├── db.json                    # Banco de dados
├── gerar-transacoes.bat       # Script Windows
├── gerar-transacoes.sh        # Script Linux/Mac
└── utils/
    ├── mocker.js              # Módulo principal
    ├── gerar-transacoes.js    # Script Node.js
    └── README.md              # Esta documentação
```
