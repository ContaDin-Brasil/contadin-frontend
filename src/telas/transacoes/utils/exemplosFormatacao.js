/**
 * EXEMPLOS DE USO - Formatação de Valores Monetários
 * 
 * Este arquivo demonstra como a formatação automática funciona
 */

import { 
  formatarValorMonetario, 
  limparValorMonetario, 
  converterParaNumero,
  formatarComMoeda 
} from './formatacaoMoeda';

// ==========================================
// TESTE 1: Formatação ao Digitar
// ==========================================
console.log('\n📝 TESTE 1: Formatação ao Digitar (Máscara Automática)');
console.log('='.repeat(60));

const testeDigitacao = [
  '1',         // -> "0,01"
  '12',        // -> "0,12"
  '123',       // -> "1,23"
  '1234',      // -> "12,34"
  '12345',     // -> "123,45"
  '123456',    // -> "1.234,56"
  '1234567',   // -> "12.345,67"
  '12345678',  // -> "123.456,78"
];

testeDigitacao.forEach(valor => {
  const formatado = formatarValorMonetario(valor);
  console.log(`  "${valor}" → "${formatado}"`);
});

// ==========================================
// TESTE 2: Limpeza de Valores de IA
// ==========================================
console.log('\n\n🧹 TESTE 2: Limpeza de Valores Vindos da IA');
console.log('='.repeat(60));

const valoresIA = [
  'R$ 145,80',
  'R$ 5.000,00',
  '1.234,56',
  'R$ 1234,56',
  '100,00',
];

valoresIA.forEach(valor => {
  const limpo = limparValorMonetario(valor);
  const numero = converterParaNumero(valor);
  console.log(`  "${valor}" → limpo: "${limpo}" → número: ${numero}`);
});

// ==========================================
// TESTE 3: Fluxo Completo (IA → Input → API)
// ==========================================
console.log('\n\n🔄 TESTE 3: Fluxo Completo (IA → Input → API)');
console.log('='.repeat(60));

// 1. Valor vindo da IA
const valorIA = 'R$ 5.000,00';
console.log('1️⃣  Valor da IA:', valorIA);

// 2. Limpar e converter para número
const valorLimpo = limparValorMonetario(valorIA);
const valorNumerico = parseFloat(valorLimpo);
console.log('2️⃣  Valor limpo:', valorLimpo, '→ número:', valorNumerico);

// 3. Formatar para exibir no input (centavos)
const valorFormatado = formatarValorMonetario((valorNumerico * 100).toString());
console.log('3️⃣  Valor formatado para input:', valorFormatado);

// 4. Converter de volta para número ao salvar
const valorParaSalvar = converterParaNumero(valorFormatado);
console.log('4️⃣  Valor para salvar na API:', valorParaSalvar);

// ==========================================
// TESTE 4: Casos Extremos
// ==========================================
console.log('\n\n⚠️  TESTE 4: Casos Extremos');
console.log('='.repeat(60));

const casosExtremos = [
  '',
  '0',
  '00',
  '000',
  '1',
  '10',
  '100',
  '1000000000', // 1 bilhão de centavos = 10 milhões
];

casosExtremos.forEach(valor => {
  const formatado = formatarValorMonetario(valor);
  const numero = converterParaNumero(formatado);
  console.log(`  "${valor}" → "${formatado}" → ${numero}`);
});

// ==========================================
// RESULTADO ESPERADO
// ==========================================
console.log('\n\n✅ RESULTADO ESPERADO NO APP:');
console.log('='.repeat(60));
console.log('Quando o usuário digita "12345":');
console.log('  • Input mostra: "123,45"');
console.log('  • Com símbolo: "R$ 123,45"');
console.log('  • Valor salvo na API: 123.45');
console.log('');
console.log('Quando a IA sugere "R$ 5.000,00":');
console.log('  • Valor é limpo: "5000.00"');
console.log('  • Input mostra: "5.000,00"');
console.log('  • Com símbolo: "R$ 5.000,00"');
console.log('  • Valor salvo na API: 5000');
console.log('');
