import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColorsByTheme } from '../styles/colors';
import { useTheme } from '../contexts/ThemeContext';

const BotaoFlutuanteAdicionar = ({ onPress, style, iconSize = 32 }) => {
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);

  return (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: COLORS.primary, shadowColor: COLORS.black }, style]}
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
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default BotaoFlutuanteAdicionar;