/**
 * EXEMPLO: Como usar o módulo mocker.js em seus próprios scripts
 * 
 * Este arquivo demonstra como importar e usar as funções do mocker
 * para criar scripts personalizados de geração de dados
 */

const {
  gerarTransacoes,
  adicionarTransacoes,
  limparTransacoes,
  mostrarEstatisticas,
  lerDatabase,
  salvarDatabase,
} = require('./mocker');

// ============================================================
// EXEMPLO 1: Gerar transações com configuração personalizada
// ============================================================

function exemploGeracaoPersonalizada() {
  console.log('\n📝 EXEMPLO 1: Geração Personalizada\n');
  
  // Configuração específica para o mês atual
  const opcoes = {
    diasAtras: 30,              // Apenas últimos 30 dias
    percentualReceitas: 40,     // Mais receitas (40%)
    percentualParcelado: 10,    // Menos parceladas
    percentualRecorrente: 20,   // Mais recorrentes
    valorMinGasto: 20,
    valorMaxGasto: 300,
    valorMinReceita: 1000,
    valorMaxReceita: 5000,
  };
  
  const transacoes = gerarTransacoes(20, opcoes);
  
  console.log(`✅ ${transacoes.length} transações geradas`);
  console.log(`💰 Receitas: ${transacoes.filter(t => t.tipo === 'RECEITA').length}`);
  console.log(`💸 Gastos: ${transacoes.filter(t => t.tipo === 'GASTO').length}\n`);
  
  // Adiciona ao banco
  adicionarTransacoes(transacoes, false);
}

// ============================================================
// EXEMPLO 2: Gerar transações apenas de uma instituição específica
// ============================================================

function exemploInstituicaoEspecifica(instituicaoId) {
  console.log('\n📝 EXEMPLO 2: Instituição Específica\n');
  
  const db = lerDatabase();
  const instituicao = db.instituicao.find(i => i.id === instituicaoId);
  
  if (!instituicao) {
    console.error(`❌ Instituição ${instituicaoId} não encontrada!`);
    return;
  }
  
  console.log(`Gerando transações para: ${instituicao.nome}\n`);
  
  // Gera transações normalmente
  const transacoes = gerarTransacoes(15, {
    diasAtras: 60,
    percentualReceitas: 30,
  });
  
  // Filtra apenas as da instituição desejada
  // Nota: Como a geração é aleatória, você pode não ter muitas da instituição específica
  // Para forçar, você precisaria modificar cada transação
  transacoes.forEach(t => {
    t.fk_instituicao = instituicaoId; // Força todas para esta instituição
  });
  
  console.log(`✅ ${transacoes.length} transações geradas para ${instituicao.nome}\n`);
  
  adicionarTransacoes(transacoes, false);
}

// ============================================================
// EXEMPLO 3: Criar cenário de teste específico
// ============================================================

function exemploCenarioTeste() {
  console.log('\n📝 EXEMPLO 3: Cenário de Teste\n');
  
  const db = lerDatabase();
  
  if (db.instituicao.length === 0 || db.categoria.length === 0) {
    console.error('❌ Adicione instituições e categorias primeiro!');
    return;
  }
  
  const instituicao = db.instituicao[0];
  const categoriaGasto = db.categoria.find(c => c.tipo === 'GASTO');
  const categoriaReceita = db.categoria.find(c => c.tipo === 'RECEITA');
  
  if (!categoriaGasto || !categoriaReceita) {
    console.error('❌ Adicione categorias de GASTO e RECEITA!');
    return;
  }
  
  // Cria transações manualmente
  const transacoesCustomizadas = [
    {
      id: Date.now() + 1,
      descricao: 'Salário do mês',
      valor: 5000,
      tipo: 'RECEITA',
      data_transacao: new Date().toISOString(),
      parcelado: false,
      qtdParcelas: 1,
      recorrencia: 'MENSAL',
      fim_recorrencia: null,
      fk_instituicao: instituicao.id,
      fk_categoria: categoriaReceita.id,
    },
    {
      id: Date.now() + 2,
      descricao: 'Aluguel',
      valor: 1500,
      tipo: 'GASTO',
      data_transacao: new Date().toISOString(),
      parcelado: false,
      qtdParcelas: 1,
      recorrencia: 'MENSAL',
      fim_recorrencia: null,
      fk_instituicao: instituicao.id,
      fk_categoria: categoriaGasto.id,
    },
    {
      id: Date.now() + 3,
      descricao: 'Notebook - Parcelado',
      valor: 3000,
      tipo: 'GASTO',
      data_transacao: new Date().toISOString(),
      parcelado: true,
      qtdParcelas: 12,
      recorrencia: null,
      fim_recorrencia: null,
      fk_instituicao: instituicao.id,
      fk_categoria: categoriaGasto.id,
    },
  ];
  
  console.log('Criando cenário de teste:');
  transacoesCustomizadas.forEach(t => {
    console.log(`  • ${t.descricao} - R$ ${t.valor}`);
  });
  console.log('');
  
  adicionarTransacoes(transacoesCustomizadas, false);
}

// ============================================================
// EXEMPLO 4: Análise e manipulação de dados
// ============================================================

function exemploAnalise() {
  console.log('\n📝 EXEMPLO 4: Análise de Dados\n');
  
  const db = lerDatabase();
  const transacoes = db.transacao || [];
  
  // Análise por instituição
  const porInstituicao = {};
  
  transacoes.forEach(t => {
    const inst = db.instituicao.find(i => i.id === t.fk_instituicao);
    const nome = inst ? inst.nome : 'Desconhecida';
    
    if (!porInstituicao[nome]) {
      porInstituicao[nome] = {
        quantidade: 0,
        receitas: 0,
        gastos: 0,
        total: 0,
      };
    }
    
    porInstituicao[nome].quantidade++;
    porInstituicao[nome].total += t.valor;
    
    if (t.tipo === 'RECEITA') {
      porInstituicao[nome].receitas += t.valor;
    } else {
      porInstituicao[nome].gastos += t.valor;
    }
  });
  
  console.log('📊 Relatório por Instituição:\n');
  
  Object.entries(porInstituicao)
    .sort((a, b) => b[1].quantidade - a[1].quantidade)
    .forEach(([nome, dados]) => {
      console.log(`${nome}:`);
      console.log(`  Transações: ${dados.quantidade}`);
      console.log(`  Receitas: R$ ${dados.receitas.toFixed(2)}`);
      console.log(`  Gastos: R$ ${dados.gastos.toFixed(2)}`);
      console.log(`  Total: R$ ${dados.total.toFixed(2)}`);
      console.log('');
    });
}

// ============================================================
// EXEMPLO 5: Backup e restore personalizados
// ============================================================

function exemploBackupRestore() {
  console.log('\n📝 EXEMPLO 5: Backup Personalizado\n');
  
  const fs = require('fs');
  const path = require('path');
  
  // Lê o banco atual
  const db = lerDatabase();
  
  // Cria backup com timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(__dirname, `backup-${timestamp}.json`);
  
  fs.writeFileSync(backupPath, JSON.stringify(db, null, 2), 'utf8');
  
  console.log(`✅ Backup criado: ${backupPath}\n`);
  
  // Para restaurar um backup:
  // const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  // salvarDatabase(backupData);
}

// ============================================================
// MENU DE EXEMPLOS
// ============================================================

function menu() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('\n🎓 EXEMPLOS DE USO DO MOCKER\n');
    console.log('Escolha um exemplo para executar:\n');
    console.log('  1. Geração personalizada');
    console.log('  2. Instituição específica');
    console.log('  3. Cenário de teste');
    console.log('  4. Análise de dados');
    console.log('  5. Backup personalizado');
    console.log('  stats. Estatísticas do banco\n');
    console.log('Uso: node exemplo-uso.js [1-5|stats]\n');
    return;
  }
  
  switch (args[0]) {
    case '1':
      exemploGeracaoPersonalizada();
      break;
    case '2':
      // Você pode passar o ID da instituição como segundo argumento
      const instId = args[1] ? parseInt(args[1]) : 4;
      exemploInstituicaoEspecifica(instId);
      break;
    case '3':
      exemploCenarioTeste();
      break;
    case '4':
      exemploAnalise();
      break;
    case '5':
      exemploBackupRestore();
      break;
    case 'stats':
      mostrarEstatisticas();
      break;
    default:
      console.log(`\n❌ Exemplo '${args[0]}' não encontrado!\n`);
      menu();
  }
}

// Executa o menu se o arquivo for chamado diretamente
if (require.main === module) {
  menu();
}

module.exports = {
  exemploGeracaoPersonalizada,
  exemploInstituicaoEspecifica,
  exemploCenarioTeste,
  exemploAnalise,
  exemploBackupRestore,
};
