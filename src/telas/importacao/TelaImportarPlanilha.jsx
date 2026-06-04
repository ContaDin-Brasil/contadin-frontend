import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Alert,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import ModalAdicionarInstituicao from '../../componentes/modais/ModalAdicionarInstituicao';
import ModalCategoria from '../categorias/modals/ModalCategoria';
import { categoriaService, importacaoPlanilhaService, instituicaoService } from '../../api';
import { setAuthToken } from '../../api/config';
import { useAuth } from '../../contexts/AuthContext';
import { getStyles } from './styles/TelaImportarPlanilha.styles';
import { useTheme } from '../../contexts/ThemeContext';
import { getColorsByTheme } from '../../styles/colors';
import { useToastFeedback } from '../transacoes/hooks/useToastFeedback';
import { CATEGORY_COLORS } from '../categorias/constants/constantesCategorias';

const ALLOWED_MIMES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
];

const IMPORT_LOADING_STEPS = [
  'Procurando transações na planilha...',
  'Organizando categorias detectadas...',
  'Mapeando instituições conhecidas...',
  'Preparando os itens para revisão...',
];

const SIMULAR_SUCESSO_SWAGGER = false;

const SWAGGER_SUCCESS_MOCK = {
  instituicoes: [
    {
      nome: 'Itaú',
      tipo: 'BANCO',
      icone: 'bank',
      cor: '#820AD1',
      id_existente: 1,
    },
    {
      nome: 'VR Beneficios',
      tipo: 'VALE',
      icone: 'card',
      cor: '#E34234',
      id_existente: 2,
    },
  ],
  categorias: [
    {
      nome: 'Alimentação',
      tipo: 'GASTO',
      icone: 'restaurant',
      cor: '#FF6B6B',
      id_existente: 10,
    },
    {
      nome: 'Salario',
      tipo: 'RECEITA',
      icone: 'cash',
      cor: '#51CF66',
      id_existente: 11,
    },
  ],
  transacoes: [
    {
      valor: 127.35,
      tipo: 'GASTO',
      descricao: 'Mercado da semana',
      data_transacao: '2026-04-14T00:00:00',
      parcelado: false,
      recorrencia: null,
      fim_transacao: null,
      instituicao: 'Itaú',
      categoria: 'Alimentacao',
      fk_instituicao: 1,
      fk_categoria: 10,
    },
    {
      valor: 5800,
      tipo: 'RECEITA',
      descricao: 'Salario mensal',
      data_transacao: '2026-04-05T00:00:00',
      parcelado: false,
      recorrencia: 'MENSAL',
      fim_transacao: null,
      instituicao: 'Nubank',
      categoria: 'Salario',
      fk_instituicao: 1,
      fk_categoria: 11,
    },
    {
      valor: 89.9,
      tipo: 'GASTO',
      descricao: '',
      data_transacao: '2026-04-11T00:00:00',
      parcelado: false,
      recorrencia: null,
      fim_transacao: null,
      instituicao: 'Nubank',
      categoria: null,
      fk_instituicao: 1,
      fk_categoria: null,
    },
    {
      valor: null,
      tipo: 'GASTO',
      descricao: 'Compra sem dados completos',
      data_transacao: '',
      parcelado: false,
      recorrencia: null,
      fim_transacao: null,
      instituicao: null,
      categoria: 'Alimentacao',
      fk_instituicao: null,
      fk_categoria: 10,
    },
  ],
  objetivos_gasto: [
    {
      nome: 'Objetivo Alimentacao Abril',
      valor: 1500,
      data_fim_objetivo: '2026-04-30',
      categoria: 'Alimentacao',
      fk_categoria: 10,
      fk_usuario: 1,
    },
  ],
};

const toNumber = (value, fallback = 0) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').trim();
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const normalizeText = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const mapSwaggerTransacao = (item, index) => ({
  localId: `swagger-${index}`,
  descricao: String(item?.descricao ?? ''),
  valor: toNumber(item?.valor, 0),
  tipo: String(item?.tipo ?? 'GASTO').toUpperCase() === 'RECEITA' ? 'RECEITA' : 'GASTO',
  dataTransacao: String(item?.data_transacao ?? new Date().toISOString()),
  fkInstituicao: item?.fk_instituicao ?? null,
  fkCategoria: item?.fk_categoria ?? null,
  selecionada: true,
  linhaOrigem: index + 1,
  observacao: [
    item?.instituicao ? `Instituicao detectada: ${item.instituicao}` : null,
    item?.categoria ? `Categoria detectada: ${item.categoria}` : null,
  ]
    .filter(Boolean)
    .join(' | '),
});

const ETLImportScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const toast = useToastFeedback();

  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getStyles(isDarkMode);

  const routeToken = route?.params?.token;
  const routeUser = route?.params?.user;
  const fromLoginSuccess = route?.params?.fromLoginSuccess === true;

  const effectiveUser = user || routeUser || null;

  useEffect(() => {
    if (fromLoginSuccess && routeToken) {
      setAuthToken(routeToken);
    }
  }, []);

  const [arquivo, setArquivo] = useState(null);
  const [loadingImport, setLoadingImport] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [transacoes, setTransacoes] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [accordionAbertos, setAccordionAbertos] = useState({});
  const [modalAdicionarInstituicao, setModalAdicionarInstituicao] = useState(false);
  const [modalAdicionarCategoria, setModalAdicionarCategoria] = useState(false);
  const [nomeFaltanteInstituicao, setNomeFaltanteInstituicao] = useState(null);
  const [nomeCategoriaFaltante, setNomeCategoriaFaltante] = useState(null);
  const [loadingMensagemIndex, setLoadingMensagemIndex] = useState(0);
  const loadingMensagemOpacity = useRef(new Animated.Value(1)).current;

  const totalSelecionadas = useMemo(
    () => transacoes.filter((item) => item.selecionada).length,
    [transacoes],
  );

  const transacaoEstaCompleta = (item) =>
    !!item.descricao?.trim() &&
    Number.isFinite(Number(item.valor)) &&
    Number(item.valor) > 0 &&
    !!item.dataTransacao?.trim() &&
    !!item.fkInstituicao &&
    !!item.fkCategoria;

  const totalPendentesAjuste = useMemo(
    () => transacoes.filter((item) => !transacaoEstaCompleta(item)).length,
    [transacoes],
  );

  useEffect(() => {
    let active = true;

    const carregarOpcoes = async () => {
      if (!effectiveUser?.id) {
        setLoadingOptions(false);
        return;
      }

      setLoadingOptions(true);
      try {
        const [listaInstituicoes, listaCategorias] = await Promise.all([
          instituicaoService.listarPorUsuario(effectiveUser.id),
          categoriaService.listarTodasPorUsuarioImportacao(effectiveUser.id),
        ]);

        if (!active) {
          return;
        }

        setInstituicoes(listaInstituicoes);
        setCategorias(listaCategorias);
      } catch (error) {
        if (!active) {
          return;
        }

        Alert.alert('Erro', 'Não foi possível carregar instituições e categorias.');
      } finally {
        if (active) {
          setLoadingOptions(false);
        }
      }
    };

    carregarOpcoes();

    return () => {
      active = false;
    };
  }, [effectiveUser?.id]);

  useEffect(() => {
    if (!loadingImport) {
      setLoadingMensagemIndex(0);
      loadingMensagemOpacity.setValue(1);
      return;
    }

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(loadingMensagemOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(loadingMensagemOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      setLoadingMensagemIndex((prev) => (prev + 1) % IMPORT_LOADING_STEPS.length);
    }, 1700);

    return () => clearInterval(interval);
  }, [loadingImport, loadingMensagemOpacity]);

  const selecionarArquivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ALLOWED_MIMES,
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const firstFile = result.assets?.[0] ?? null;

      if (!firstFile?.uri) {
        Alert.alert('Arquivo inválido', 'Selecione um arquivo .xlsx, .xls ou .csv.');
        return;
      }

      setArquivo({
        uri: firstFile.uri,
        name: firstFile.name || 'planilha.xlsx',
        mimeType: firstFile.mimeType,
        size: firstFile.size,
        webFile: firstFile.file ?? null,
      });
      setTransacoes([]);
      setAccordionAbertos({});
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo.');
    }
  };

  const importarPlanilha = async () => {
    if (!arquivo) {
      Alert.alert('Arquivo necessário', 'Selecione uma planilha para importar.');
      return;
    }

    if (loadingOptions) {
      Alert.alert('Aguarde', 'Carregando instituições e categorias.');
      return;
    }

    if (!SIMULAR_SUCESSO_SWAGGER && (instituicoes.length === 0 || categorias.length === 0)) {
      Alert.alert(
        'Dados incompletos',
        'Cadastre ao menos uma instituição e uma categoria antes de importar.',
      );
      return;
    }

    setLoadingImport(true);
    try {
      let importadas = [];

      if (SIMULAR_SUCESSO_SWAGGER) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        importadas = (SWAGGER_SUCCESS_MOCK.transacoes || []).map(mapSwaggerTransacao);
      } else {
        importadas = await importacaoPlanilhaService.importarArquivo(arquivo, routeToken);
      }

      const instituicaoByNome = new Map(
        instituicoes.map((inst) => [normalizeText(inst.nome), inst.id]),
      );
      const categoriaByNome = new Map(
        categorias.map((cat) => [normalizeText(cat.nome), cat.id]),
      );

      const ajustadas = importadas.map((item) => {
        const instituicaoNome = item?.instituicaoNome ?? item?.instituicao ?? '';
        const categoriaNome = item?.categoriaNome ?? item?.categoria ?? '';

        const fkInstituicaoPorNome = instituicaoNome
          ? instituicaoByNome.get(normalizeText(instituicaoNome)) ?? null
          : null;
        const fkCategoriaPorNome = categoriaNome
          ? categoriaByNome.get(normalizeText(categoriaNome)) ?? null
          : null;

        return {
          ...item,
          fkInstituicao: item.fkInstituicao ?? fkInstituicaoPorNome,
          fkCategoria: item.fkCategoria ?? fkCategoriaPorNome,
          instituicaoNome,
          categoriaNome,
        };
      });

      const comEstadoInicial = ajustadas.map((item) => {
        const completa = transacaoEstaCompleta(item);
        return {
          ...item,
          selecionada: completa,
        };
      });

      const estadoAccordionInicial = comEstadoInicial.reduce((acc, item) => {
        acc[item.localId] = !transacaoEstaCompleta(item);
        return acc;
      }, {});

      setTransacoes(comEstadoInicial);
      setAccordionAbertos(estadoAccordionInicial);

      if (comEstadoInicial.length === 0) {
        Alert.alert('Sem transações', 'A planilha foi processada, mas não retornou registros.');
      }
    } catch (error) {
      Alert.alert('Erro na importação', 'Não foi possível processar sua planilha no sistema.');
    } finally {
      setLoadingImport(false);
    }
  };

  const atualizarTransacao = (localId, changes) => {
    setTransacoes((prev) =>
      prev.map((item) => (item.localId === localId ? { ...item, ...changes } : item)),
    );
  };

  const resolverPendenciasComDePara = (listaInstituicoes = instituicoes, listaCategorias = categorias) => {
    const instituicaoByNome = new Map(
      listaInstituicoes.map((inst) => [normalizeText(inst.nome), inst.id]),
    );
    const categoriaByNome = new Map(
      listaCategorias.map((cat) => [normalizeText(cat.nome), cat.id]),
    );

    setTransacoes((prev) =>
      prev.map((item) => {
        const fkInstituicaoResolvida =
          !item.fkInstituicao && item.instituicaoNome
            ? instituicaoByNome.get(normalizeText(item.instituicaoNome)) ?? null
            : item.fkInstituicao;

        const fkCategoriaResolvida =
          !item.fkCategoria && item.categoriaNome
            ? categoriaByNome.get(normalizeText(item.categoriaNome)) ?? null
            : item.fkCategoria;

        const atualizado = {
          ...item,
          fkInstituicao: fkInstituicaoResolvida,
          fkCategoria: fkCategoriaResolvida,
        };

        const completaAntes = transacaoEstaCompleta(item);
        const completaDepois = transacaoEstaCompleta(atualizado);

        if (!completaAntes && completaDepois) {
          return { ...atualizado, selecionada: true };
        }

        return atualizado;
      }),
    );

    setAccordionAbertos((prev) => {
      const next = { ...prev };
      transacoes.forEach((item) => {
        const fkInstituicaoResolvida =
          !item.fkInstituicao && item.instituicaoNome
            ? instituicaoByNome.get(normalizeText(item.instituicaoNome)) ?? null
            : item.fkInstituicao;

        const fkCategoriaResolvida =
          !item.fkCategoria && item.categoriaNome
            ? categoriaByNome.get(normalizeText(item.categoriaNome)) ?? null
            : item.fkCategoria;

        const completaDepois = transacaoEstaCompleta({
          ...item,
          fkInstituicao: fkInstituicaoResolvida,
          fkCategoria: fkCategoriaResolvida,
        });

        if (completaDepois) {
          next[item.localId] = false;
        }
      });
      return next;
    });
  };

  const atualizarPendencias = () => {
    resolverPendenciasComDePara(instituicoes, categorias);
    toast.show('Pendências atualizadas', 'Tentamos vincular instituições e categorias por nome', 'success');
  };

  const alternarAccordion = (localId) => {
    setAccordionAbertos((prev) => ({
      ...prev,
      [localId]: !prev[localId],
    }));
  };

  // Obter nomes das instituições e categorias mockadas
  const obterNomeInstituicao = (id) => {
    const mockInst = SWAGGER_SUCCESS_MOCK.instituicoes.find((i) => i.id_existente === id);
    if (mockInst) return mockInst.nome;
    const inst = instituicoes.find((i) => i.id === id);
    return inst?.nome || `Instituição #${id}`;
  };

  const obterNomeCategoria = (id) => {
    const mockCat = SWAGGER_SUCCESS_MOCK.categorias.find((c) => c.id_existente === id);
    if (mockCat) return mockCat.nome;
    const cat = categorias.find((c) => c.id === id);
    return cat?.nome || `Categoria #${id}`;
  };

  const obterInstituicaoFaltante = (transacao) => {
    if (transacao.fkInstituicao) return null;
    const nome = transacao.instituicaoNome?.trim();
    if (!nome) return null;

    const existe = instituicoes.some((i) => normalizeText(i.nome) === normalizeText(nome));
    return existe ? null : nome;
  };

  const obterCategoriaFaltante = (transacao) => {
    if (transacao.fkCategoria) return null;
    const nome = transacao.categoriaNome?.trim();
    if (!nome) return null;

    const existe = categorias.some((c) => normalizeText(c.nome) === normalizeText(nome));
    return existe ? null : nome;
  };

  const validarInstituicoesECategorias = useMemo(() => {
    const candidatas = transacoes.filter((item) => {
      const instituicaoDetectadaSemVinculo = !item.fkInstituicao && !!item.instituicaoNome?.trim();
      const categoriaDetectadaSemVinculo = !item.fkCategoria && !!item.categoriaNome?.trim();
      return item.selecionada || instituicaoDetectadaSemVinculo || categoriaDetectadaSemVinculo;
    });

    if (candidatas.length === 0) {
      return { validas: true, mensagem: null, faltantes: { instituicoes: [], categorias: [] } };
    }

    const instituicoesFaltantes = new Map(); // nome → id
    const categoriasFaltantes = new Map(); // nome → id

    candidatas.forEach((transacao) => {
      if (transacao.fkInstituicao) {
        const nomeInstituicao = obterNomeInstituicao(transacao.fkInstituicao);
        // Validar pelo NOME em vez do ID
        const existeInstituicao = instituicoes.some((i) => i.nome === nomeInstituicao);
        if (!existeInstituicao) {
          instituicoesFaltantes.set(nomeInstituicao, transacao.fkInstituicao);
        }
      } else if (transacao.instituicaoNome?.trim()) {
        const nomeInstituicao = transacao.instituicaoNome.trim();
        const existeInstituicao = instituicoes.some(
          (i) => normalizeText(i.nome) === normalizeText(nomeInstituicao),
        );
        if (!existeInstituicao) {
          instituicoesFaltantes.set(nomeInstituicao, `nome:${nomeInstituicao}`);
        }
      }
      
      if (transacao.fkCategoria) {
        const nomeCategoria = obterNomeCategoria(transacao.fkCategoria);
        // Validar pelo NOME em vez do ID
        const existeCategoria = categorias.some((c) => c.nome === nomeCategoria);
        if (!existeCategoria) {
          categoriasFaltantes.set(nomeCategoria, transacao.fkCategoria);
        }
      } else if (transacao.categoriaNome?.trim()) {
        const nomeCategoria = transacao.categoriaNome.trim();
        const existeCategoria = categorias.some(
          (c) => normalizeText(c.nome) === normalizeText(nomeCategoria),
        );
        if (!existeCategoria) {
          categoriasFaltantes.set(nomeCategoria, `nome:${nomeCategoria}`);
        }
      }
    });

    if (instituicoesFaltantes.size > 0 || categoriasFaltantes.size > 0) {
      const totalInstituicoes = instituicoesFaltantes.size;
      const totalCategorias = categoriasFaltantes.size;
      const mensagem =
        `Pendências detectadas: ${totalInstituicoes} instituição(ões) e ${totalCategorias} categoria(s).` +
        '\nUse os botões dentro de cada transação pendente para cadastrar e vincular automaticamente.';

      return { 
        validas: false, 
        mensagem,
        faltantes: { 
          instituicoes: Array.from(instituicoesFaltantes.entries()),
          categorias: Array.from(categoriasFaltantes.entries())
        }
      };
    }

    return { validas: true, mensagem: null, faltantes: { instituicoes: [], categorias: [] } };
  }, [transacoes, instituicoes, categorias]);

  const salvarImportacao = async () => {
    // Validar instituições e categorias
    if (!validarInstituicoesECategorias.validas) {
      Alert.alert(
        'Validação necessária',
        `${validarInstituicoesECategorias.mensagem}\n\nAbra os cards pendentes para cadastrar os itens faltantes.`,
        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ],
      );
      return;
    }

    const selecionadas = transacoes.filter((item) => item.selecionada);
    const pendentes = selecionadas.filter((item) => !transacaoEstaCompleta(item));

    if (selecionadas.length === 0) {
      Alert.alert('Campos obrigatórios', 'Selecione ao menos uma transacao para salvar.');
      return;
    }

    if (pendentes.length > 0) {
      Alert.alert(
        'Transações pendentes',
        `Você possui ${pendentes.length} transação(ões) com campos incompletos que não será(ão) adicionada(s).\n\nDeseja continuar?`,
        [
          {
            text: 'Cancelar',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Continuar',
            onPress: async () => {
              await executarSalvarImportacao();
            },
          },
        ],
      );
      return;
    }

    await executarSalvarImportacao();
  };

  const executarSalvarImportacao = async () => {
    setLoadingSave(true);
    try {
      const selecionadas = transacoes.filter((item) => item.selecionada && transacaoEstaCompleta(item));
      
      // Debug: mostrar dados sendo enviados
      console.log('=== DEBUG IMPORTAÇÃO ===');
      console.log('Token:', routeToken ? 'presente' : 'ausente');
      console.log('Usuário:', effectiveUser?.id);
      console.log('Total de transações filtradas:', selecionadas.length);
      console.log('Transações selecionadas para envio:', JSON.stringify(selecionadas, null, 2));
      
      const resultado = await importacaoPlanilhaService.confirmarTransacoes(selecionadas, routeToken);

      let mensagemToast = `✅ ${resultado.criadas} transação(ões) adicionada(s)`;
      if (resultado.falhas > 0) {
        mensagemToast += ` | ❌ ${resultado.falhas} falha(s)`;
      }

      console.log('✅ VALIDAÇÃO DE INSTITUIÇÕES E CATEGORIAS');
      console.log('Instituições carregadas:', instituicoes.map((i) => `${i.id}: ${i.nome}`));
      console.log('Categorias carregadas:', categorias.map((c) => `${c.id}: ${c.nome}`));
      console.log('Instituições e categorias válidas? ', validarInstituicoesECategorias.validas);

      toast.show('Importação finalizada', mensagemToast, 'success');

      Alert.alert(
        'Importacao finalizada',
        `Transacoes criadas: ${resultado.criadas}\nFalhas: ${resultado.falhas}`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (fromLoginSuccess) {
                navigation.goBack();
                return;
              }

              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.error('Erro ao salvar transações:', error);
      const mensagemErro = error?.response?.data?.message || error?.message || 'Erro desconhecido';
      toast.showError(mensagemErro, 'Erro ao adicionar');
      Alert.alert('Erro', mensagemErro);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleAdicionarInstituicao = async (novaInstituicao) => {
    console.log('handleAdicionarInstituicao chamado com:', novaInstituicao);
    try {
      // 1. Salvar no banco de dados primeiro
      console.log('Enviando instituição para o servidor...');
      const instituicaoSalva = await instituicaoService.criar({
        nome: novaInstituicao.nome,
        tipo: novaInstituicao.tipo,
        cor: novaInstituicao.cor,
        icone: novaInstituicao.icone,
        fkUsuario: effectiveUser?.id,
      });

      console.log('Instituição salva no servidor:', instituicaoSalva);

      // 2. Adicionar ao estado local
      setInstituicoes((insts) => {
        const updated = [...insts, instituicaoSalva];
        console.log('Instituições atualizadas:', updated);
        resolverPendenciasComDePara(updated, categorias);
        return updated;
      });
      
      toast.show(
        'Sucesso',
        `Instituição "${instituicaoSalva.nome}" cadastrada!`,
        'success'
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar instituição:', error);
      toast.showError('Erro', 'Não foi possível adicionar a instituição');
      return false;
    }
  };

  const handleAdicionarCategoria = async (categoriaNova) => {
    console.log('handleAdicionarCategoria chamado com:', categoriaNova);
    try {
      // 1. Salvar no banco de dados primeiro
      console.log('Enviando categoria para o servidor...');
      const categoriaSalva = await categoriaService.criar({
        nome: categoriaNova.nome,
        tipo: categoriaNova.tipo,
        cor: categoriaNova.cor,
        icone: categoriaNova.icone,
        fkUsuario: effectiveUser?.id,
      });

      console.log('Categoria salva no servidor:', categoriaSalva);

      // 2. Adicionar ao estado local
      setCategorias((cats) => {
        const updated = [...cats, categoriaSalva];
        console.log('Categorias atualizadas:', updated);
        resolverPendenciasComDePara(instituicoes, updated);
        return updated;
      });
      
      toast.show(
        'Sucesso',
        `Categoria "${categoriaSalva.nome}" cadastrada!`,
        'success'
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast.showError('Erro', 'Não foi possível adicionar a categoria');
      return false;
    }
  };

  // Debug: log quando o modal abre/fecha
  useEffect(() => {
    console.log('Estado modal:', { modalAdicionarCategoria, nomeCategoriaFaltante });
  }, [modalAdicionarCategoria, nomeCategoriaFaltante]);

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina mostrarBotaoVoltar onVoltar={() => navigation.goBack()}>
        Importar planilha
      </TituloPagina>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Arquivo Excel</Text>
          <Text style={styles.cardDescription}>
            Envie .xlsx, .xls ou .csv. O sistema de ETL interpreta os dados e devolve transações.
          </Text>

          <TouchableOpacity style={styles.selectButton} onPress={selecionarArquivo}>
            <Ionicons name="document-attach-outline" size={18} color="#FFFFFF" />
            <Text style={styles.selectButtonText}>Selecionar arquivo</Text>
          </TouchableOpacity>

          {arquivo ? <Text style={styles.fileName}>Arquivo: {arquivo.name}</Text> : null}

          <TouchableOpacity
            style={[styles.importButton, (!arquivo || loadingImport) && styles.buttonDisabled]}
            onPress={importarPlanilha}
            disabled={!arquivo || loadingImport}
          >
            {loadingImport ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />
                <Text style={styles.importButtonText}>Enviar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {loadingOptions ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="small" color="#0066FF" />
            <Text style={styles.loadingText}>Carregando instituicoes e categorias...</Text>
          </View>
        ) : null}

        {loadingImport ? (
          <View style={styles.importLoadingCard}>
            <View style={styles.importLoadingRow}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.importLoadingTitle}>Processando planilha</Text>
            </View>
            <Animated.Text
              style={[
                styles.importLoadingStep,
                { opacity: loadingMensagemOpacity },
              ]}
            >
              {IMPORT_LOADING_STEPS[loadingMensagemIndex]}
            </Animated.Text>
            <Text style={styles.importLoadingHint}>Isso pode levar alguns segundos.</Text>
          </View>
        ) : null}

        {!loadingOptions && transacoes.length > 0 && !validarInstituicoesECategorias.validas ? (
          <View style={styles.validationErrorCard}>
            <View style={styles.validationErrorHeader}>
              <Ionicons name="alert-circle" size={24} color="#E31C23" />
              <Text style={styles.validationErrorTitle}>Validação necessária</Text>
            </View>
            <Text style={styles.validationErrorMessage}>
              {validarInstituicoesECategorias.mensagem}
            </Text>

            <TouchableOpacity
              style={styles.refreshPendingButton}
              onPress={atualizarPendencias}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh-outline" size={18} color={COLORS.white} />
              <Text style={styles.refreshPendingButtonText}>Atualizar pendências</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {transacoes.length > 0 ? (
          <View style={styles.reviewSection}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewTitle}>Revisar transacoes ({transacoes.length})</Text>
              <Text style={styles.reviewSubtitle}>
                Selecionadas para salvar: {totalSelecionadas} | Pendentes de ajuste: {totalPendentesAjuste}
              </Text>
            </View>

            <ScrollView
              style={styles.reviewListScroll}
              contentContainerStyle={styles.reviewListContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator
            >
              {transacoes.map((item, index) => (
                <View key={item.localId} style={styles.transactionCard}>
                  {(() => {
                    const instituicaoFaltante = obterInstituicaoFaltante(item);
                    const categoriaFaltante = obterCategoriaFaltante(item);

                    if (!instituicaoFaltante && !categoriaFaltante) {
                      return null;
                    }

                    return (
                      <View style={styles.pendingActionGroup}>
                        {instituicaoFaltante ? (
                          <TouchableOpacity
                            style={styles.pendingActionButton}
                            onPress={() => {
                              setNomeFaltanteInstituicao(instituicaoFaltante);
                              setModalAdicionarInstituicao(true);
                            }}
                            activeOpacity={0.85}
                          >
                            <Ionicons name="add-circle-outline" size={16} color={COLORS.white} />
                            <Text style={styles.pendingActionButtonText}>
                              Cadastrar instituição: {instituicaoFaltante}
                            </Text>
                          </TouchableOpacity>
                        ) : null}

                        {categoriaFaltante ? (
                          <TouchableOpacity
                            style={styles.pendingActionButton}
                            onPress={() => {
                              setNomeCategoriaFaltante(categoriaFaltante);
                              setModalAdicionarCategoria(true);
                            }}
                            activeOpacity={0.85}
                          >
                            <Ionicons name="add-circle-outline" size={16} color={COLORS.white} />
                            <Text style={styles.pendingActionButtonText}>
                              Cadastrar categoria: {categoriaFaltante}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    );
                  })()}

                  <View style={styles.transactionHeader}>
                    <TouchableOpacity
                      style={styles.transactionHeaderLeft}
                      onPress={() => alternarAccordion(item.localId)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.transactionTitleRow}>
                        <Text style={styles.transactionTitle}>Linha {item.linhaOrigem || index + 1}</Text>
                        {transacaoEstaCompleta(item) ? (
                          <View style={styles.statusBadgeCompleta}>
                            <Text style={styles.statusBadgeTextCompleta}>Completa</Text>
                          </View>
                        ) : (
                          <View style={styles.statusBadgePendente}>
                            <Text style={styles.statusBadgeTextPendente}>Pendente</Text>
                          </View>
                        )}
                      </View>
                      <Ionicons
                        name={accordionAbertos[item.localId] ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#5B6675"
                      />
                    </TouchableOpacity>

                    <View style={styles.switchRow}>
                      <Text style={styles.switchLabel}>Salvar</Text>
                      <Switch
                        value={item.selecionada && transacaoEstaCompleta(item)}
                        onValueChange={(value) => transacaoEstaCompleta(item) && atualizarTransacao(item.localId, { selecionada: value })}
                        trackColor={{ false: '#D3E4FF', true: COLORS.primaryLight }}
                        thumbColor={item.selecionada && transacaoEstaCompleta(item) ? COLORS.primary : COLORS.textLight}
                        disabled={!transacaoEstaCompleta(item)}
                      />
                    </View>
                  </View>

                  {!accordionAbertos[item.localId] ? (
                    <Text style={styles.collapsedSummary} numberOfLines={1}>
                      {item.descricao?.trim() || 'Sem descricao'} | R$ {toNumber(item.valor).toFixed(2)}
                    </Text>
                  ) : (
                    <>
                      {!!item.observacao && <Text style={styles.noteText}>{item.observacao}</Text>}
                      {!item.fkInstituicao && item.instituicaoNome ? (
                        <Text style={styles.noteText}>
                          Instituição detectada na planilha: {item.instituicaoNome} (não cadastrada)
                        </Text>
                      ) : null}
                      {!item.fkCategoria && item.categoriaNome ? (
                        <Text style={styles.noteText}>
                          Categoria detectada na planilha: {item.categoriaNome} (não cadastrada)
                        </Text>
                      ) : null}

                      <TextInput
                        style={styles.input}
                        value={item.descricao}
                        onChangeText={(value) => atualizarTransacao(item.localId, { descricao: value })}
                        placeholder="Descricao"
                      />

                      <View style={styles.twoColumns}>
                        <TextInput
                          style={[styles.input, styles.halfInput]}
                          value={String(item.valor)}
                          onChangeText={(value) => atualizarTransacao(item.localId, { valor: value.replace(',', '.') })}
                          keyboardType="decimal-pad"
                          placeholder="Valor"
                        />
                        <TextInput
                          style={[styles.input, styles.halfInput]}
                          value={item.dataTransacao}
                          onChangeText={(value) => {
                            // Permite apenas números, hífens, T e dois pontos
                            const limpo = value.replace(/[^0-9T:\-]/g, '');
                            atualizarTransacao(item.localId, { dataTransacao: limpo });
                          }}
                          placeholder="YYYY-MM-DD ou ISO"
                        />
                      </View>

                      <View style={styles.pickerContainer}>
                        <Picker
                          style={styles.picker}
                          itemStyle={{ color: COLORS.textPrimary }}
                          selectedValue={item.tipo}
                          onValueChange={(value) => atualizarTransacao(item.localId, { tipo: value })}
                        >
                          <Picker.Item label="Gasto" value="GASTO" />
                          <Picker.Item label="Receita" value="RECEITA" />
                        </Picker>
                      </View>

                      <View style={styles.pickerContainer}>
                        <Picker
                          style={styles.picker}
                          itemStyle={{ color: COLORS.textPrimary }}
                          selectedValue={item.fkInstituicao ?? ''}
                          onValueChange={(value) =>
                            atualizarTransacao(item.localId, {
                              fkInstituicao: value === '' ? null : value,
                            })
                          }
                        >
                          <Picker.Item label="Selecione uma instituicao" value="" />
                          {instituicoes.map((inst) => (
                            <Picker.Item key={String(inst.id)} label={inst.nome} value={inst.id} />
                          ))}
                        </Picker>
                      </View>

                      <View style={styles.pickerContainer}>
                        <Picker
                          style={styles.picker}
                          itemStyle={{ color: COLORS.textPrimary }}
                          selectedValue={item.fkCategoria ?? ''}
                          onValueChange={(value) =>
                            atualizarTransacao(item.localId, {
                              fkCategoria: value === '' ? null : value,
                            })
                          }
                        >
                          <Picker.Item label="Selecione uma categoria" value="" />
                          {categorias.map((cat) => (
                            <Picker.Item key={String(cat.id)} label={`${cat.nome} (${cat.tipo})`} value={cat.id} />
                          ))}
                        </Picker>
                      </View>
                    </>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {transacoes.length > 0 ? (
          <TouchableOpacity
            style={[styles.saveButton, loadingSave && styles.buttonDisabled]}
            onPress={salvarImportacao}
            disabled={loadingSave}
          >
            {loadingSave ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Adicionar selecionadas ao sistema</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </ScrollView>

      {/* Modal para adicionar instituição */}
      <ModalAdicionarInstituicao
        visible={modalAdicionarInstituicao}
        onClose={() => {
          setModalAdicionarInstituicao(false);
          setNomeFaltanteInstituicao(null);
        }}
        onAdd={handleAdicionarInstituicao}
        nomeInicial={nomeFaltanteInstituicao}
        tipoInicial="banco"
      />

      {/* Modal para adicionar categoria - reutiliza ModalCategoria do fluxo comum */}
      <ModalCategoria
        visible={modalAdicionarCategoria}
        onClose={() => {
          setModalAdicionarCategoria(false);
          setNomeCategoriaFaltante(null);
        }}
        onSave={handleAdicionarCategoria}
        categoria={null}
        nomeInicial={nomeCategoriaFaltante}
        tipoInicial="GASTO"
      />
    </SafeAreaView>
  );
};

export default ETLImportScreen;
