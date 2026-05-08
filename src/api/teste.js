/**
 * Arquivo de teste para verificar a conexão com a API
 * 
 * COMO USAR:
 * 1. Certifique-se de que o mock server está rodando (cd mock-server && npm start)
 * 2. Importe este arquivo em algum componente e chame testarAPI()
 * 3. Verifique o console para ver os resultados
 */

import {
  transacaoService,
  instituicaoService,
  categoriaService,
  objetivoGastoService,
  usuarioService,
} from './index';

/**
 * Testa todos os serviços da API
 */
export const testarAPI = async () => {
  console.log('========================================');
  console.log('🧪 INICIANDO TESTES DA API');
  console.log('========================================\n');

  try {
    // Teste 1: Listar transações
    console.log('📋 Teste 1: Listar transações');
    const transacoes = await transacaoService.listar();
    console.log(`✅ ${transacoes.length} transações encontradas`);
    console.log('Primeira transação:', transacoes[0]);
    console.log('');

    // Teste 2: Listar instituições
    console.log('🏦 Teste 2: Listar instituições');
    const instituicoes = await instituicaoService.listar();
    console.log(`✅ ${instituicoes.length} instituições encontradas`);
    console.log('Primeira instituição:', instituicoes[0]);
    console.log('');

    // Teste 3: Listar categorias
    console.log('📂 Teste 3: Listar categorias');
    const categorias = await categoriaService.listar();
    console.log(`✅ ${categorias.length} categorias encontradas`);
    console.log('Primeira categoria:', categorias[0]);
    console.log('');

    // Teste 4: Criar nova transação
    console.log('➕ Teste 4: Criar nova transação');
    const novaTransacao = {
      valor: 25.99,
      tipo: 'GASTO',
      descricao: 'Teste de API - Café',
      data_transacao: new Date().toISOString(),
      parcelado: false,
      recorrencia: null,
      fim_recorrencia: null,
      fk_instituicao: 1,
      fk_categoria: 1,
    };
    const transacaoCriada = await transacaoService.criar(novaTransacao);
    console.log('✅ Transação criada com ID:', transacaoCriada.id);
    console.log('Transação criada:', transacaoCriada);
    console.log('');

    // Teste 5: Atualizar transação
    console.log('✏️ Teste 5: Atualizar transação');
    const transacaoAtualizada = await transacaoService.atualizar(
      transacaoCriada.id,
      {
        ...transacaoCriada,
        descricao: 'Teste de API - Café Atualizado',
        valor: 30.50,
      }
    );
    console.log('✅ Transação atualizada:', transacaoAtualizada);
    console.log('');

    // Teste 6: Buscar transações por tipo
    console.log('🔍 Teste 6: Buscar transações por tipo (GASTO)');
    const gastos = await transacaoService.listarPorTipo('GASTO');
    console.log(`✅ ${gastos.length} gastos encontrados`);
    console.log('');

    // Teste 7: Deletar transação
    console.log('🗑️ Teste 7: Deletar transação de teste');
    await transacaoService.deletar(transacaoCriada.id);
    console.log('✅ Transação deletada com sucesso');
    console.log('');

    // Teste 8: Buscar por período
    console.log('📅 Teste 8: Buscar transações do mês atual');
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    
    const transacoesMes = await transacaoService.listarPorPeriodo(
      primeiroDia.toISOString(),
      ultimoDia.toISOString()
    );
    console.log(`✅ ${transacoesMes.length} transações no mês atual`);
    console.log('');

    // Teste 9: Buscar objetivos
    console.log('🎯 Teste 9: Listar objetivos');
    const objetivos = await objetivoGastoService.listarPorUsuario(1, false);
    console.log(`✅ ${objetivos.length} objetivos encontrados`);
    if (objetivos.length > 0) {
      console.log('Primeiro objetivo:', objetivos[0]);
    }
    console.log('');

    // Teste 10: Buscar usuário
    console.log('👤 Teste 10: Buscar usuário por ID');
    const usuario = await usuarioService.buscarPorId(1);
    console.log('✅ Usuário encontrado:', usuario.nome);
    console.log('');

    console.log('========================================');
    console.log('✅ TODOS OS TESTES PASSARAM COM SUCESSO!');
    console.log('========================================');
    
    return true;
  } catch (error) {
    console.error('========================================');
    console.error('❌ ERRO NOS TESTES:');
    console.error('========================================');
    console.error('Erro:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }
    console.error('');
    console.error('⚠️ VERIFIQUE SE O MOCK SERVER ESTÁ RODANDO:');
    console.error('   cd mock-server && npm start');
    console.error('========================================');
    
    return false;
  }
};

/**
 * Teste rápido de conexão
 */
export const testarConexao = async () => {
  try {
    console.log('🔌 Testando conexão com a API...');
    const transacoes = await transacaoService.listar();
    console.log(`✅ Conexão OK! ${transacoes.length} transações encontradas.`);
    return true;
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    console.error('⚠️ Certifique-se de que o mock server está rodando.');
    return false;
  }
};
