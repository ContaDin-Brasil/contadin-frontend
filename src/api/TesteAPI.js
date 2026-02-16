/**
 * Componente de Teste da API
 * 
 * Use este componente para testar rapidamente a conexão com a API
 * 
 * COMO USAR:
 * 1. Certifique-se de que o mock server está rodando
 * 2. Importe este componente em App.js ou outra tela
 * 3. Pressione os botões para testar as operações
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { transacaoService } from './index';

const TesteAPI = () => {
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);

  const exibirResultado = (titulo, dados) => {
    setResultado(`${titulo}\n\n${JSON.stringify(dados, null, 2)}`);
  };

  const testarListar = async () => {
    setLoading(true);
    try {
      const transacoes = await transacaoService.listar();
      exibirResultado('✅ Listar Transações', {
        total: transacoes.length,
        transacoes: transacoes.slice(0, 2), // Mostra apenas 2 primeiras
      });
    } catch (error) {
      exibirResultado('❌ Erro ao Listar', { erro: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testarCriar = async () => {
    setLoading(true);
    try {
      const nova = await transacaoService.criar({
        valor: 25.50,
        tipo: 'GASTO',
        descricao: 'Teste de API',
        data_transacao: new Date().toISOString(),
        parcelado: false,
        recorrencia: null,
        fim_recorrencia: null,
        fk_instituicao: 1,
        fk_categoria: 1,
      });
      exibirResultado('✅ Transação Criada', nova);
    } catch (error) {
      exibirResultado('❌ Erro ao Criar', { erro: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testarAtualizar = async () => {
    setLoading(true);
    try {
      // Busca a primeira transação para atualizar
      const transacoes = await transacaoService.listar();
      if (transacoes.length === 0) {
        exibirResultado('⚠️ Nenhuma transação para atualizar', {});
        return;
      }

      const primeira = transacoes[0];
      const atualizada = await transacaoService.atualizar(primeira.id, {
        ...primeira,
        descricao: `${primeira.descricao} - ATUALIZADO`,
      });
      exibirResultado('✅ Transação Atualizada', atualizada);
    } catch (error) {
      exibirResultado('❌ Erro ao Atualizar', { erro: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testarDeletar = async () => {
    setLoading(true);
    try {
      // Busca a última transação para deletar
      const transacoes = await transacaoService.listar();
      if (transacoes.length === 0) {
        exibirResultado('⚠️ Nenhuma transação para deletar', {});
        return;
      }

      const ultima = transacoes[transacoes.length - 1];
      await transacaoService.deletar(ultima.id);
      exibirResultado('✅ Transação Deletada', { id: ultima.id });
    } catch (error) {
      exibirResultado('❌ Erro ao Deletar', { erro: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testarFiltros = async () => {
    setLoading(true);
    try {
      const gastos = await transacaoService.listarPorTipo('GASTO');
      const receitas = await transacaoService.listarPorTipo('RECEITA');
      
      const totalGastos = gastos.reduce((sum, t) => sum + t.valor, 0);
      const totalReceitas = receitas.reduce((sum, t) => sum + t.valor, 0);
      
      exibirResultado('✅ Filtros (Gastos vs Receitas)', {
        gastos: gastos.length,
        totalGastos: `R$ ${totalGastos.toFixed(2)}`,
        receitas: receitas.length,
        totalReceitas: `R$ ${totalReceitas.toFixed(2)}`,
        saldo: `R$ ${(totalReceitas - totalGastos).toFixed(2)}`,
      });
    } catch (error) {
      exibirResultado('❌ Erro ao Filtrar', { erro: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🧪 Teste da API</Text>
      
      {loading && (
        <ActivityIndicator size="large" color="#8A05BE" style={styles.loading} />
      )}

      <View style={styles.botoesContainer}>
        <Botao 
          titulo="Listar" 
          onPress={testarListar} 
          cor="#2196F3"
          disabled={loading}
        />
        <Botao 
          titulo="Criar" 
          onPress={testarCriar} 
          cor="#4CAF50"
          disabled={loading}
        />
        <Botao 
          titulo="Atualizar" 
          onPress={testarAtualizar} 
          cor="#FF9800"
          disabled={loading}
        />
        <Botao 
          titulo="Deletar" 
          onPress={testarDeletar} 
          cor="#F44336"
          disabled={loading}
        />
        <Botao 
          titulo="Filtros" 
          onPress={testarFiltros} 
          cor="#9C27B0"
          disabled={loading}
        />
      </View>

      <ScrollView style={styles.resultadoContainer}>
        <Text style={styles.resultadoTexto}>
          {resultado || 'Pressione um botão para testar a API'}
        </Text>
      </ScrollView>
    </View>
  );
};

const Botao = ({ titulo, onPress, cor, disabled }) => (
  <TouchableOpacity
    style={[styles.botao, { backgroundColor: cor }, disabled && styles.botaoDisabled]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.botaoTexto}>{titulo}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loading: {
    marginVertical: 10,
  },
  botoesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  botao: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 5,
    minWidth: 100,
  },
  botaoDisabled: {
    opacity: 0.5,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultadoContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  resultadoTexto: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});

export default TesteAPI;
