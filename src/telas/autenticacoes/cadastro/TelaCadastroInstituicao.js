import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../../componentes/TituloPagina';
import { instituicaoService } from '../../../api';
import { styles } from './styles/TelaCadastroInstituicao.styles';

const CORES_PREDEFINIDAS = [
  '#E31C23', '#FF4444', '#FF6B6B', '#FF6600',
  '#FF9500', '#FFED00', '#FFD700', '#00AB63',
  '#21C25E', '#00E676', '#00D9E1', '#009EE3',
  '#007AFF', '#005CA9', '#820AD1', '#9C27B0',
  '#E91E63', '#CC092F', '#8B4513', '#666666',
  '#000000', '#4A9EFF',
];

function TelaCadastroInstituicao({ navigation, route }) {
  const { user } = route.params || {};
  const userId = user && typeof user === 'object' && 'id' in user ? user.id : null;
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('banco');
  const [cor, setCor] = useState('#E31C23');
  const [iconePersonalizado, setIconePersonalizado] = useState('');
  const [showCores, setShowCores] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleContinuar = async () => {
    setError(null);
    const nomeTrim = nome.trim();
    if (!nomeTrim) {
      setError('Informe o nome da instituição.');
      return;
    }
    if (!userId) {
      setError('Sessão inválida. Faça login novamente.');
      return;
    }

    setLoading(true);
    try {
      await instituicaoService.criar({
        nome: nomeTrim,
        icone: iconePersonalizado.trim() || nomeTrim.charAt(0).toUpperCase(),
        cor,
        tipoInstituicao: tipo,
        fk_usuario: userId,
      });
      setLoading(false);
      navigation.goBack();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Falha ao cadastrar instituição.';
      setError(String(msg));
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina
        mostrarBotaoVoltar={true}
        onVoltar={() => navigation.goBack()}
      >
        Cadastre sua Instituição.
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome para a instituição</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Meu Banco"
            placeholderTextColor="#999"
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cor Destaque para a instituição</Text>
          <TouchableOpacity
            style={styles.seletorCor}
            onPress={() => setShowCores(!showCores)}
            activeOpacity={0.7}
          >
            <View style={[styles.corPreview, { backgroundColor: cor }]} />
            <Text style={styles.corHex}>{cor.toUpperCase()}</Text>
            <Ionicons
              name={showCores ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
          {showCores && (
            <View style={styles.gridCores}>
              {CORES_PREDEFINIDAS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.corOption,
                    { backgroundColor: c },
                    cor === c && styles.corOptionSelected,
                  ]}
                  onPress={() => {
                    setCor(c);
                    setShowCores(false);
                  }}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Selecione o tipo de instituição</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[styles.typeButton, tipo === 'banco' && styles.typeButtonActive]}
              onPress={() => setTipo('banco')}
            >
              <Ionicons name="business" size={18} color={tipo === 'banco' ? '#FFF' : '#666'} />
              <Text style={[styles.typeButtonText, tipo === 'banco' && styles.typeButtonTextActive]}>
                Banco
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, tipo === 'vale' && styles.typeButtonActive]}
              onPress={() => setTipo('vale')}
            >
              <Ionicons name="card" size={18} color={tipo === 'vale' ? '#FFF' : '#666'} />
              <Text style={[styles.typeButtonText, tipo === 'vale' && styles.typeButtonTextActive]}>
                Vale
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Adicionar ícone personalizado (opcional)</Text>
          <TextInput
            style={styles.input}
            value={iconePersonalizado}
            onChangeText={setIconePersonalizado}
            placeholder="Ex: 1 ou 2 letras"
            placeholderTextColor="#999"
            maxLength={2}
            editable={!loading}
          />
        </View>

        {error ? <Text style={styles.mensagemErro}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.botao}
          onPress={handleContinuar}
          disabled={loading}
        >
          <Text style={styles.botaoText}>{loading ? 'Salvando...' : 'Continuar'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TelaCadastroInstituicao;
