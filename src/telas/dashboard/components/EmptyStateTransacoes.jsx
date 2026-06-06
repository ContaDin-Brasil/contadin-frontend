import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ToastAndroid, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getStyles } from '../styles/TelaInicial.styles';
import ModalAviso from '../../../componentes/modais/ModalAviso';
import { getColorsByTheme } from '../../../styles/colors';
import { useTheme } from '../../../contexts/ThemeContext';

/**
 * Componente que exibe um empty state quando não há transações cadastradas
 * Motiva o usuário a adicionar a primeira transação
 */
export const EmptyStateTransacoes = ({ onAdicionarTransacao }) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const COLORS = getColorsByTheme(isDarkMode);
  const navigation = useNavigation();
  const [modalAviso, setModalAviso] = useState({ visible: false, titulo: '', mensagem: '' });

  const fecharAviso = () => {
    setModalAviso((prev) => ({ ...prev, visible: false }));
    navigation.navigate('Carteira');
  };

  const handleExplorarCarteira = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(
        '💡 Dica: Você também pode explorar Categorias e Objetivos!',
        ToastAndroid.LONG
      );
      navigation.navigate('Carteira');
    } else {
      setModalAviso({ visible: true, titulo: 'Dica', mensagem: 'Você também pode explorar Categorias e Objetivos!' });
    }
  };

  // Usar primaryLight no modo claro para manter o padrão
  const iconColor = isDarkMode ? COLORS.primary : COLORS.primaryLight;

  return (
    <View style={styles.emptyStateContainer}>
      {/* Ícone com background */}
      <View style={styles.emptyStateIconContainer}>
        <MaterialCommunityIcons
          name="wallet-plus-outline"
          size={60}
          color={iconColor}
          style={styles.emptyStateIcon}
        />
      </View>

      {/* Título */}
      <Text style={styles.emptyStateTitle}>
        Bem-vindo ao Contadin!
      </Text>

      {/* Descrição */}
      <Text style={styles.emptyStateDescription}>
        Comece a registrar suas transações para visualizar seu saldo, receitas e gastos em tempo real.
      </Text>

      {/* Botão principal */}
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={onAdicionarTransacao}
        activeOpacity={0.8}
      >
        <Text style={styles.emptyStateButtonText}>
          + Adicionar Primeira Transação
        </Text>
      </TouchableOpacity>

      {/* Botão secundário - Explorar Instituições */}
      <TouchableOpacity
        style={styles.emptyStateSecondaryButton}
        onPress={handleExplorarCarteira}
        activeOpacity={0.7}
      >
        <Text style={styles.emptyStateSecondaryButtonText}>
          Explorar Instituições
        </Text>
      </TouchableOpacity>

      <ModalAviso
        visible={modalAviso.visible}
        titulo={modalAviso.titulo}
        mensagem={modalAviso.mensagem}
        onClose={fecharAviso}
      />
    </View>
  );
};
