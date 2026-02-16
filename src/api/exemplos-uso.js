/**
 * Exemplos práticos de uso dos serviços de API em componentes React Native
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import { 
  transacaoService, 
  instituicaoService, 
  categoriaService 
} from '../api';

/**
 * ========================================
 * EXEMPLO 1: Listar transações em um componente
 * ========================================
 */
export const ExemploListarTransacoes = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarTransacoes();
  }, []);

  const carregarTransacoes = async () => {
    setLoading(true);
    setErro(null);
    
    try {
      const dados = await transacaoService.listar();
      setTransacoes(dados);
    } catch (error) {
      setErro('Erro ao carregar transações');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (erro) return <Text>{erro}</Text>;

  return (
    <FlatList
      data={transacoes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.descricao}</Text>
          <Text>R$ {item.valor.toFixed(2)}</Text>
        </View>
      )}
    />
  );
};

/**
 * ========================================
 * EXEMPLO 2: Criar nova transação
 * ========================================
 */
export const ExemploCriarTransacao = () => {
  const [criando, setCriando] = useState(false);

  const handleCriarTransacao = async () => {
    setCriando(true);

    try {
      const novaTransacao = {
        valor: 89.90,
        tipo: 'GASTO',
        descricao: 'Supermercado',
        data_transacao: new Date().toISOString(),
        parcelado: false,
        recorrencia: null,
        fim_recorrencia: null,
        fk_instituicao: 1,
        fk_categoria: 1
      };

      const transacaoCriada = await transacaoService.criar(novaTransacao);
      console.log('Transação criada:', transacaoCriada);
      alert('Transação criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      alert('Erro ao criar transação');
    } finally {
      setCriando(false);
    }
  };

  return (
    <Button 
      title={criando ? "Criando..." : "Criar Transação"} 
      onPress={handleCriarTransacao}
      disabled={criando}
    />
  );
};

/**
 * ========================================
 * EXEMPLO 3: Editar instituição
 * ========================================
 */
export const ExemploEditarInstituicao = ({ instituicaoId }) => {
  const [instituicao, setInstituicao] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarInstituicao();
  }, [instituicaoId]);

  const carregarInstituicao = async () => {
    try {
      const dados = await instituicaoService.buscarPorId(instituicaoId);
      setInstituicao(dados);
    } catch (error) {
      console.error('Erro ao carregar instituição:', error);
    }
  };

  const handleSalvar = async () => {
    setSalvando(true);

    try {
      const dadosAtualizados = {
        ...instituicao,
        nome: 'Nubank - Conta Corrente', // exemplo de alteração
      };

      const atualizada = await instituicaoService.atualizar(
        instituicaoId, 
        dadosAtualizados
      );
      
      setInstituicao(atualizada);
      alert('Instituição atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar instituição');
    } finally {
      setSalvando(false);
    }
  };

  if (!instituicao) return <ActivityIndicator />;

  return (
    <View>
      <Text>{instituicao.nome}</Text>
      <Button 
        title={salvando ? "Salvando..." : "Salvar"} 
        onPress={handleSalvar}
        disabled={salvando}
      />
    </View>
  );
};

/**
 * ========================================
 * EXEMPLO 4: Deletar categoria
 * ========================================
 */
export const ExemploDeletarCategoria = ({ categoriaId, onDeletar }) => {
  const [deletando, setDeletando] = useState(false);

  const handleDeletar = async () => {
    setDeletando(true);

    try {
      await categoriaService.deletar(categoriaId);
      alert('Categoria deletada com sucesso!');
      if (onDeletar) onDeletar();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar categoria');
    } finally {
      setDeletando(false);
    }
  };

  return (
    <Button 
      title={deletando ? "Deletando..." : "Deletar"} 
      onPress={handleDeletar}
      disabled={deletando}
      color="red"
    />
  );
};

/**
 * ========================================
 * EXEMPLO 5: Buscar transações por período (mês atual)
 * ========================================
 */
export const ExemploTransacoesMesAtual = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarTransacoesMes();
  }, []);

  const carregarTransacoesMes = async () => {
    setLoading(true);

    try {
      const hoje = new Date();
      const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

      const dataInicio = primeiroDia.toISOString();
      const dataFim = ultimoDia.toISOString();

      const dados = await transacaoService.listarPorPeriodo(
        dataInicio, 
        dataFim
      );
      
      setTransacoes(dados);
    } catch (error) {
      console.error('Erro ao carregar transações do mês:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text>Transações de {new Date().toLocaleDateString('pt-BR', { month: 'long' })}</Text>
      <FlatList
        data={transacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.descricao} - R$ {item.valor.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
};

/**
 * ========================================
 * EXEMPLO 6: Carregar dados de múltiplos serviços
 * ========================================
 */
export const ExemploCarregarMultiplosDados = () => {
  const [dados, setDados] = useState({
    instituicoes: [],
    categorias: [],
    transacoes: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarTodosDados();
  }, []);

  const carregarTodosDados = async () => {
    setLoading(true);

    try {
      const usuarioId = 1; // ID do usuário logado

      // Buscar todos os dados em paralelo
      const [instituicoes, categorias, transacoes] = await Promise.all([
        instituicaoService.listarPorUsuario(usuarioId),
        categoriaService.listarPorUsuario(usuarioId),
        transacaoService.listar()
      ]);

      setDados({
        instituicoes,
        categorias,
        transacoes
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text>Instituições: {dados.instituicoes.length}</Text>
      <Text>Categorias: {dados.categorias.length}</Text>
      <Text>Transações: {dados.transacoes.length}</Text>
    </View>
  );
};

/**
 * ========================================
 * EXEMPLO 7: Filtrar transações por tipo
 * ========================================
 */
export const ExemploFiltrarPorTipo = () => {
  const [gastos, setGastos] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);

    try {
      const [gastosData, receitasData] = await Promise.all([
        transacaoService.listarPorTipo('GASTO'),
        transacaoService.listarPorTipo('RECEITA')
      ]);

      setGastos(gastosData);
      setReceitas(receitasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalGastos = gastos.reduce((sum, t) => sum + t.valor, 0);
  const totalReceitas = receitas.reduce((sum, t) => sum + t.valor, 0);
  const saldo = totalReceitas - totalGastos;

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text>Gastos: R$ {totalGastos.toFixed(2)}</Text>
      <Text>Receitas: R$ {totalReceitas.toFixed(2)}</Text>
      <Text>Saldo: R$ {saldo.toFixed(2)}</Text>
    </View>
  );
};

/**
 * ========================================
 * EXEMPLO 8: Hook customizado para transações
 * ========================================
 */
export const useTransacoes = (usuarioId) => {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);

    try {
      const dados = await transacaoService.listar();
      setTransacoes(dados);
    } catch (error) {
      setErro(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const criar = async (transacao) => {
    try {
      const nova = await transacaoService.criar(transacao);
      setTransacoes([...transacoes, nova]);
      return nova;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const atualizar = async (id, transacao) => {
    try {
      const atualizada = await transacaoService.atualizar(id, transacao);
      setTransacoes(
        transacoes.map(t => t.id === id ? atualizada : t)
      );
      return atualizada;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deletar = async (id) => {
    try {
      await transacaoService.deletar(id);
      setTransacoes(transacoes.filter(t => t.id !== id));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return {
    transacoes,
    loading,
    erro,
    carregar,
    criar,
    atualizar,
    deletar
  };
};

// Uso do hook customizado:
export const ExemploUsoHook = () => {
  const { transacoes, loading, criar, deletar } = useTransacoes(1);

  const handleCriar = async () => {
    await criar({
      valor: 50,
      tipo: 'GASTO',
      descricao: 'Teste',
      data_transacao: new Date().toISOString(),
      parcelado: false,
      recorrencia: null,
      fim_recorrencia: null,
      fk_instituicao: 1,
      fk_categoria: 1
    });
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Button title="Criar Transação" onPress={handleCriar} />
      <FlatList
        data={transacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.descricao}</Text>
            <Button 
              title="Deletar" 
              onPress={() => deletar(item.id)} 
            />
          </View>
        )}
      />
    </View>
  );
};
