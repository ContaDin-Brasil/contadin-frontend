import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../styles/colors';

const BotaoFlutuanteAdicionar = ({ onPress, style, iconSize = 32 }) => {
  return (
    <TouchableOpacity
      style={[styles.botao, style]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Adicionar"
    >
      <Ionicons name="add" size={iconSize} color={COLORS.white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botao: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default BotaoFlutuanteAdicionar;