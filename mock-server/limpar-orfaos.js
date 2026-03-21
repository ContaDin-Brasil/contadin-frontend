/**
 * Script para limpar transações órfãs do db.json
 * Executa diretamente no arquivo JSON sem precisar da API
 */

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

console.log('🧹 Iniciando limpeza de transações órfãs...\n');

// Lê o arquivo db.json
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Extrai IDs válidos de instituições
const idsInstituicoesValidas = db.instituicao.map(inst => inst.id);
console.log(`🏦 Instituições válidas encontradas: ${idsInstituicoesValidas.length}`);
console.log(`   IDs: [${idsInstituicoesValidas.join(', ')}]\n`);

// Filtra transações órfãs
const transacoesAntes = db.transacao.length;
const transacoesOrfas = db.transacao.filter(
  t => !idsInstituicoesValidas.includes(t.fk_instituicao)
);

console.log(`📊 Total de transações: ${transacoesAntes}`);
console.log(`🔍 Transações órfãs encontradas: ${transacoesOrfas.length}\n`);

if (transacoesOrfas.length > 0) {
  console.log('📋 Lista de transações órfãs:');
  transacoesOrfas.forEach(t => {
    console.log(`   • ID ${t.id}: "${t.descricao}" - R$ ${t.valor}`);
    console.log(`     └─ Instituição ${t.fk_instituicao} não existe mais`);
  });
  console.log('');

  // Remove transações órfãs
  db.transacao = db.transacao.filter(
    t => idsInstituicoesValidas.includes(t.fk_instituicao)
  );

  // Salva o arquivo atualizado
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

  console.log(`✅ ${transacoesOrfas.length} transações órfãs removidas com sucesso!`);
  console.log(`📊 Total de transações após limpeza: ${db.transacao.length}`);
} else {
  console.log('✅ Nenhuma transação órfã encontrada!');
  console.log('   Seu banco de dados está limpo! 🎉');
}

console.log('\n✨ Limpeza concluída!\n');
