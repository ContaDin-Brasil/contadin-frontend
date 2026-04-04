import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/colors';

/**
 * Componente de título padrão para todas as páginas
 * Mantém consistência visual em todo o aplicativo
 * 
 * @param {string} children - O texto do título
 * @param {object} style - Estilos customizados adicionais
 * @param {boolean} mostrarBotaoVoltar - Se true, exibe botão de voltar
 * @param {function} onVoltar - Função callback quando o botão de voltar é pressionado
 */
const TituloPagina = ({ children, style, mostrarBotaoVoltar = false, onVoltar }) => {
  if (mostrarBotaoVoltar) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onVoltar} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={[styles.titleWithButton, style]}>
          {children}
        </Text>
      </View>
    );
  }

  return (
    <Text style={[styles.title, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
    color: COLORS.black,
    marginTop: 24,
  },
  titleWithButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    flex: 1,
  },
});

export default TituloPagina;
