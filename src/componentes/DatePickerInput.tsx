import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../styles/colors';

interface DatePickerInputProps {
  value: string; // Data no formato DD/MM/YYYY
  onChangeDate: (text: string) => void;
  placeholder?: string;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  errorMessage?: string;
  style?: any;
}

/**
 * Componente de input de data com seletor nativo
 * Suporta entrada manual (DD/MM/YYYY) e seleção via DatePicker nativo
 */
export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChangeDate,
  placeholder = 'DD/MM/AAAA',
  label,
  minDate,
  maxDate,
  errorMessage,
  style,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  /**
   * Converte string DD/MM/YYYY para objeto Date
   */
  const parseDate = (dateStr: string): Date => {
    if (!dateStr || dateStr.length < 10) {
      return new Date();
    }
    
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  /**
   * Converte Date para string DD/MM/YYYY
   */
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  /**
   * Handler do DatePicker nativo
   */
  const handlePickerChange = (event: any, selectedDate?: Date) => {
    // Fecha o picker no Android após selecionar
    // No iOS mantém aberto (comportamento padrão do iOS)
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }
    
    if (selectedDate) {
      const formatted = formatDate(selectedDate);
      onChangeDate(formatted);
    }
  };

  /**
   * Formata a data enquanto o usuário digita
   */
  const handleTextChange = (text: string) => {
    // Remove tudo que não é número
    const cleaned = text.replace(/\D/g, '');
    
    // Adiciona as barras automaticamente
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    }
    
    onChangeDate(formatted);
  };

  /**
   * Abre o DatePicker
   */
  const openPicker = () => {
    setShowPicker(true);
  };

  const currentDate = parseDate(value);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputContainer, errorMessage && styles.inputContainerError]}>
        <Ionicons name="calendar-outline" size={20} color={errorMessage ? COLORS.error : '#666'} />
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          maxLength={10}
        />
        
        <TouchableOpacity onPress={openPicker} style={styles.pickerButton}>
          <Ionicons name="chevron-down" size={20} color={errorMessage ? COLORS.error : '#666'} />
        </TouchableOpacity>
      </View>

      {errorMessage && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {showPicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handlePickerChange}
          minimumDate={minDate}
          maximumDate={maxDate}
          locale="pt-BR"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputContainerError: {
    borderColor: COLORS.error,
    backgroundColor: '#ffebee',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  pickerButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginLeft: 4,
  },
});
