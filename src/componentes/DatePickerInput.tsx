import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
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
 * Componente de input de data com seletor adequado para cada plataforma
 * Web: input type="date" nativo
 * iOS/Android: Modal com calendário
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
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const isWeb = Platform.OS === 'web';

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
   * Converte DD/MM/YYYY para YYYY-MM-DD (formato HTML input)
   */
  const convertToHtmlFormat = (dateStr: string): string => {
    if (!dateStr || dateStr.length < 10) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  /**
   * Converte YYYY-MM-DD para DD/MM/YYYY
   */
  const convertFromHtmlFormat = (htmlDate: string): string => {
    if (!htmlDate) return '';
    const [year, month, day] = htmlDate.split('-');
    return `${day}/${month}/${year}`;
  };

  /**
   * Handler do DatePicker modal (mobile)
   */
  const handleConfirm = (date: Date) => {
    const formatted = formatDate(date);
    onChangeDate(formatted);
    setDatePickerVisibility(false);
  };

  /**
   * Formata a data enquanto o usuário digita (mobile)
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
   * Abre o DatePicker modal (mobile)
   */
  const openPicker = () => {
    setDatePickerVisibility(true);
  };

  /**
   * Handler para input HTML (web)
   */
  const handleWebDateChange = (e: any) => {
    const htmlDate = e.target.value;
    if (htmlDate) {
      const formatted = convertFromHtmlFormat(htmlDate);
      onChangeDate(formatted);
    }
  };

  const currentDate = parseDate(value);
  const htmlDateValue = convertToHtmlFormat(value);

  // Renderização específica para web
  if (isWeb) {
    return (
      <View style={[styles.container, style]}>
        {label && <Text style={styles.label}>{label}</Text>}
        
        <View style={[styles.inputContainer, errorMessage && styles.inputContainerError]}>
          <Ionicons name="calendar-outline" size={20} color={errorMessage ? COLORS.error : '#666'} />
          
          <input
            type="date"
            value={htmlDateValue}
            onChange={handleWebDateChange}
            style={{
              flex: 1,
              fontSize: 16,
              color: '#333',
              marginLeft: 12,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'System',
            } as any}
          />
        </View>

        {errorMessage && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={14} color={COLORS.error} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
      </View>
    );
  }

  // Renderização para mobile (iOS/Android)
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

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
        date={currentDate}
        minimumDate={minDate}
        maximumDate={maxDate}
        locale="pt_BR"
        headerTextIOS="Selecione a data"
        confirmTextIOS="Confirmar"
        cancelTextIOS="Cancelar"
        isDarkModeEnabled={false}
      />
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
