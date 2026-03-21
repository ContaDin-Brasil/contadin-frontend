#!/usr/bin/env node

const {
  gerarTransacoes,
  adicionarTransacoes,
  limparTransacoes,
  mostrarEstatisticas,
} = require('./mocker');

/**
 * Script para gerar transações mockadas
 * 
 * Exemplos de uso:
 * node gerar-transacoes.js               - Gera 50 transações (padrão)
 * node gerar-transacoes.js 100           - Gera 100 transações
 * node gerar-transacoes.js limpar        - Remove todas as transações
 * node gerar-transacoes.js stats         - Mostra estatísticas do banco
 * node gerar-transacoes.js 30 limpar     - Remove existentes e gera 30 novas
 */

const args = process.argv.slice(2);

// Verifica comandos especiais
if (args.includes('limpar') && args.length === 1) {
  console.log('\n🗑️  Limpando banco de dados...\n');
  limparTransacoes();
  process.exit(0);
}

if (args.includes('stats') || args.includes('estatisticas')) {
  mostrarEstatisticas();
  process.exit(0);
}

// Configuração padrão
let quantidade = 50;
let limparExistentes = false;

// Processa argumentos
if (args.length > 0) {
  const numeroArg = args.find(arg => !isNaN(parseInt(arg)));
  if (numeroArg) {
    quantidade = parseInt(numeroArg);
  }
  
  if (args.includes('limpar') || args.includes('--limpar') || args.includes('-l')) {
    limparExistentes = true;
  }
}

console.log('\n🎲 GERADOR DE TRANSAÇÕES MOCKADAS');
console.log('═'.repeat(50));
console.log('');

if (limparExistentes) {
  limparTransacoes();
  console.log('');
}

// Opções de geração personalizadas
const opcoes = {
  diasAtras: 90,              // Gera transações dos últimos 90 dias
  percentualReceitas: 25,     // 25% receitas, 75% gastos (mais realista)
  percentualParcelado: 20,    // 20% das transações parceladas
  percentualRecorrente: 15,   // 15% das transações recorrentes
  valorMinGasto: 10,          // Gasto mínimo: R$ 10
  valorMaxGasto: 800,         // Gasto máximo: R$ 800
  valorMinReceita: 500,       // Receita mínima: R$ 500
  valorMaxReceita: 8000,      // Receita máxima: R$ 8.000
};

// Gera transações
const transacoes = gerarTransacoes(quantidade, opcoes);

if (transacoes.length > 0) {
  console.log('');
  adicionarTransacoes(transacoes, false);
  console.log('');
  mostrarEstatisticas();
} else {
  console.log('\n❌ Nenhuma transação foi gerada!\n');
  process.exit(1);
}

console.log('✅ Processo concluído!\n');
