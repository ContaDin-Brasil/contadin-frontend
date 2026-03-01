const fs = require('fs');
const path = require('path');

/**
 * Utilitário para mockar transações no banco de dados
 * Gera transações aleatórias usando instituições e categorias existentes
 */

// Descrições de exemplo para transações
const DESCRICOES_GASTOS = [
  'Supermercado',
  'Restaurante',
  'Uber',
  'Combustível',
  'Farmácia',
  'Cinema',
  'Netflix',
  'Spotify',
  'Academia',
  'Aluguel',
  'Conta de Luz',
  'Conta de Água',
  'Internet',
  'Celular',
  'Padaria',
  'Lanchonete',
  'Delivery iFood',
  'Estacionamento',
  'Pedágio',
  'Dentista',
  'Médico',
  'Curso Online',
  'Livros',
  'Roupas',
  'Sapatos',
  'Presente',
  'Material Escolar',
  'Pet Shop',
  'Barbeiro',
  'Salão de Beleza',
];

const DESCRICOES_RECEITAS = [
  'Salário',
  'Freelance',
  'Venda Online',
  'Cashback',
  'Reembolso',
  'Bonificação',
  'Dividendos',
  'Aluguel Recebido',
  'Prêmio',
  'Bônus',
];

const RECORRENCIAS = ['MENSAL', 'SEMANAL', 'ANUAL', 'DIARIO'];

/**
 * Lê o arquivo db.json
 */
function lerDatabase() {
  const dbPath = path.join(__dirname, '..', 'db.json');
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

/**
 * Salva o arquivo db.json
 */
function salvarDatabase(db) {
  const dbPath = path.join(__dirname, '..', 'db.json');
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

/**
 * Gera um valor aleatório entre min e max
 */
function valorAleatorio(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

/**
 * Gera uma data aleatória nos últimos N dias
 */
function dataAleatoria(diasAtras = 30) {
  const hoje = new Date();
  const diasAleatorio = Math.floor(Math.random() * diasAtras);
  const data = new Date(hoje);
  data.setDate(data.getDate() - diasAleatorio);
  return data.toISOString();
}

/**
 * Escolhe um item aleatório de um array
 */
function escolherAleatorio(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Gera transações mockadas
 * @param {number} quantidade - Quantidade de transações a gerar
 * @param {object} opcoes - Opções de geração
 * @returns {Array} Array de transações geradas
 */
function gerarTransacoes(quantidade = 50, opcoes = {}) {
  const db = lerDatabase();
  
  const instituicoes = db.instituicao || [];
  const categorias = db.categoria || [];
  
  if (instituicoes.length === 0) {
    console.error('❌ Nenhuma instituição encontrada no banco de dados!');
    console.log('   Por favor, adicione instituições antes de gerar transações.');
    return [];
  }
  
  if (categorias.length === 0) {
    console.error('❌ Nenhuma categoria encontrada no banco de dados!');
    console.log('   Por favor, adicione categorias antes de gerar transações.');
    return [];
  }
  
  const transacoes = [];
  const transacoesExistentes = db.transacao || [];
  let proximoId = transacoesExistentes.length > 0 
    ? Math.max(...transacoesExistentes.map(t => t.id)) + 1 
    : 1;
  
  const {
    diasAtras = 60,
    percentualReceitas = 30, // 30% receitas, 70% gastos
    percentualParcelado = 15, // 15% parcelado
    percentualRecorrente = 10, // 10% recorrente
    valorMinGasto = 10,
    valorMaxGasto = 500,
    valorMinReceita = 100,
    valorMaxReceita = 5000,
  } = opcoes;
  
  console.log('🎲 Gerando transações mockadas...');
  console.log(`   📊 Instituições disponíveis: ${instituicoes.length}`);
  console.log(`   📊 Categorias disponíveis: ${categorias.length}`);
  console.log('');
  
  for (let i = 0; i < quantidade; i++) {
    const ehReceita = Math.random() * 100 < percentualReceitas;
    const tipo = ehReceita ? 'RECEITA' : 'GASTO';
    
    // Filtra categorias por tipo
    const categoriasDoTipo = categorias.filter(c => c.tipo === tipo);
    if (categoriasDoTipo.length === 0) {
      console.warn(`⚠️  Sem categorias do tipo ${tipo}, pulando transação ${i + 1}`);
      continue;
    }
    
    const categoria = escolherAleatorio(categoriasDoTipo);
    const instituicao = escolherAleatorio(instituicoes);
    
    const descricoes = ehReceita ? DESCRICOES_RECEITAS : DESCRICOES_GASTOS;
    const descricao = escolherAleatorio(descricoes);
    
    const valorMin = ehReceita ? valorMinReceita : valorMinGasto;
    const valorMax = ehReceita ? valorMaxReceita : valorMaxGasto;
    const valor = valorAleatorio(valorMin, valorMax);
    
    const ehParcelado = Math.random() * 100 < percentualParcelado;
    const ehRecorrente = !ehParcelado && Math.random() * 100 < percentualRecorrente;
    
    const parcelasOpcoes = [2, 3, 4, 6, 12];
    const qtdParcelas = ehParcelado ? escolherAleatorio(parcelasOpcoes) : 1;
    
    const recorrencia = ehRecorrente ? escolherAleatorio(RECORRENCIAS) : null;
    
    const transacao = {
      id: proximoId++,
      descricao,
      valor,
      tipo,
      data_transacao: dataAleatoria(diasAtras),
      parcelado: ehParcelado,
      qtdParcelas: qtdParcelas,
      recorrencia: recorrencia,
      fim_recorrencia: null,
      fk_instituicao: instituicao.id,
      fk_categoria: categoria.id,
    };
    
    transacoes.push(transacao);
  }
  
  console.log(`✅ ${transacoes.length} transações geradas com sucesso!`);
  return transacoes;
}

/**
 * Adiciona transações ao banco de dados
 * @param {Array} transacoes - Array de transações a adicionar
 * @param {boolean} limparExistentes - Se true, remove transações existentes antes de adicionar
 */
function adicionarTransacoes(transacoes, limparExistentes = false) {
  const db = lerDatabase();
  
  if (limparExistentes) {
    console.log('🗑️  Removendo transações existentes...');
    db.transacao = [];
  }
  
  db.transacao = [...(db.transacao || []), ...transacoes];
  
  salvarDatabase(db);
  console.log(`✅ ${transacoes.length} transações adicionadas ao banco de dados!`);
  console.log(`📊 Total de transações no banco: ${db.transacao.length}`);
}

/**
 * Remove todas as transações do banco
 */
function limparTransacoes() {
  const db = lerDatabase();
  const totalAntes = (db.transacao || []).length;
  db.transacao = [];
  salvarDatabase(db);
  console.log(`🗑️  ${totalAntes} transações removidas do banco de dados!`);
}

/**
 * Mostra estatísticas do banco de dados
 */
function mostrarEstatisticas() {
  const db = lerDatabase();
  
  const transacoes = db.transacao || [];
  const instituicoes = db.instituicao || [];
  const categorias = db.categoria || [];
  
  console.log('\n📊 Estatísticas do Banco de Dados');
  console.log('═'.repeat(50));
  console.log(`📝 Transações: ${transacoes.length}`);
  console.log(`🏦 Instituições: ${instituicoes.length}`);
  console.log(`📂 Categorias: ${categorias.length}`);
  console.log('');
  
  if (transacoes.length > 0) {
    const receitas = transacoes.filter(t => t.tipo === 'RECEITA');
    const gastos = transacoes.filter(t => t.tipo === 'GASTO');
    const parceladas = transacoes.filter(t => t.parcelado);
    const recorrentes = transacoes.filter(t => t.recorrencia);
    
    console.log('💰 Tipos de Transação:');
    console.log(`   Receitas: ${receitas.length} (${((receitas.length / transacoes.length) * 100).toFixed(1)}%)`);
    console.log(`   Gastos: ${gastos.length} (${((gastos.length / transacoes.length) * 100).toFixed(1)}%)`);
    console.log('');
    console.log('📌 Características:');
    console.log(`   Parceladas: ${parceladas.length} (${((parceladas.length / transacoes.length) * 100).toFixed(1)}%)`);
    console.log(`   Recorrentes: ${recorrentes.length} (${((recorrentes.length / transacoes.length) * 100).toFixed(1)}%)`);
    console.log('');
    
    const totalReceitas = receitas.reduce((sum, t) => sum + t.valor, 0);
    const totalGastos = gastos.reduce((sum, t) => sum + t.valor, 0);
    const saldo = totalReceitas - totalGastos;
    
    console.log('💵 Valores:');
    console.log(`   Total Receitas: R$ ${totalReceitas.toFixed(2)}`);
    console.log(`   Total Gastos: R$ ${totalGastos.toFixed(2)}`);
    console.log(`   Saldo: R$ ${saldo.toFixed(2)}`);
  }
  
  if (instituicoes.length > 0) {
    console.log('');
    console.log('🏦 Instituições cadastradas:');
    instituicoes.forEach(inst => {
      const transacoesInst = transacoes.filter(t => t.fk_instituicao === inst.id);
      console.log(`   • ${inst.nome} (ID: ${inst.id}) - ${transacoesInst.length} transações`);
    });
  }
  
  console.log('═'.repeat(50));
  console.log('');
}

module.exports = {
  gerarTransacoes,
  adicionarTransacoes,
  limparTransacoes,
  mostrarEstatisticas,
  lerDatabase,
  salvarDatabase,
};
