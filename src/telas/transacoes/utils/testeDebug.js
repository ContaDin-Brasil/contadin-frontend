/**
 * TESTE DE DEBUG - Formatação de Valores
 * Execute este arquivo para verificar como os valores estão sendo processados
 */

// Simulando as funções
const apenasNumeros = (valor) => valor.replace(/\D/g, '');

const limparValorMonetario = (valor) => {
  if (!valor) return '';
  let limpo = valor
    .replace(/R\$/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '');
  limpo = limpo.replace(',', '.');
  return limpo;
};

const formatarValorMonetario = (valor) => {
  console.log('  🔧 [FORMATAR] Entrada:', valor);
  const apenasDigitos = apenasNumeros(valor);
  console.log('  🔧 [FORMATAR] Apenas dígitos:', apenasDigitos);
  
  if (!apenasDigitos) return '';
  
  const numeroFormatado = parseInt(apenasDigitos) / 100;
  console.log('  🔧 [FORMATAR] Número:', numeroFormatado);
  
  const resultado = numeroFormatado.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  console.log('  🔧 [FORMATAR] Saída:', resultado);
  
  return resultado;
};

const converterParaNumero = (valor) => {
  const limpo = limparValorMonetario(valor);
  return parseFloat(limpo) || 0;
};

// ==========================================
// TESTE DO PROBLEMA REPORTADO
// ==========================================
console.log('\n🐛 TESTE DO PROBLEMA: Aplicar sugestão da IA');
console.log('='.repeat(60));

// 1. IA retorna este valor
const valorIA = '145,80';
console.log('1️⃣  Valor da IA:', valorIA);

// 2. Aplicar sugestão (código antigo - BUGADO)
console.log('\n❌ CÓDIGO ANTIGO (BUGADO):');
const valorLimpo = limparValorMonetario(valorIA);
console.log('  Valor limpo:', valorLimpo);
const valorNumerico = parseFloat(valorLimpo);
console.log('  Valor numérico:', valorNumerico);
const centavos = valorNumerico * 100;
console.log('  Centavos:', centavos);
const valorFormatadoAntigo = formatarValorMonetario(centavos.toString());
console.log('  Resultado:', valorFormatadoAntigo);

// 3. Aplicar sugestão (código novo - CORRETO)
console.log('\n✅ CÓDIGO NOVO (CORRETO):');
const valorFormatadoNovo = valorIA.trim();
console.log('  Resultado:', valorFormatadoNovo);

// 4. Verificar se handleValorChange detecta formato válido
console.log('\n🔍 VERIFICAÇÃO DE FORMATO:');
const text = '145,80';
const partes = text.split(',');
console.log('  Partes:', partes);
console.log('  Tem vírgula?', text.includes(','));
console.log('  É válido?', partes.length === 2 && partes[1].length <= 2);

// 5. Testar conversão para salvar
console.log('\n💾 CONVERSÃO PARA SALVAR:');
const valorParaSalvar = converterParaNumero('145,80');
console.log('  "145,80" → ', valorParaSalvar);

// ==========================================
// TESTE COM VALOR GRANDE
// ==========================================
console.log('\n\n💰 TESTE COM VALOR GRANDE:');
console.log('='.repeat(60));

const valorGrandeIA = '5.000,00';
console.log('Valor da IA:', valorGrandeIA);
console.log('Aplicando direto:', valorGrandeIA.trim());
console.log('Para salvar:', converterParaNumero(valorGrandeIA));

// ==========================================
// TESTE DE DIGITAÇÃO NORMAL
// ==========================================
console.log('\n\n⌨️  TESTE DE DIGITAÇÃO NORMAL:');
console.log('='.repeat(60));

const digitacoes = ['1', '12', '123', '1234', '12345'];
digitacoes.forEach(digi => {
  const formatado = formatarValorMonetario(digi);
  console.log(`Digitou "${digi}" → Mostra "${formatado}"`);
});

console.log('\n✅ TESTES CONCLUÍDOS!');
