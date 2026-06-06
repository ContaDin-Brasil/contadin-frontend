/**
 * Componente para exibir mensagens de erro de validação
 * Aparece abaixo de inputs obrigatórios que não foram preenchidos corretamente
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../../styles/colors';

interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons 
        name="alert-circle" 
        size={16} 
        color={COLORS.error} 
        style={styles.icon}
      />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
});
