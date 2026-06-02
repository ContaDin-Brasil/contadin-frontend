import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStyles } from '../styles/TelaInicial.styles';
import { getColorsByTheme } from '../../../styles/colors';
import { useTheme } from '../../../contexts/ThemeContext';

interface CardResumoProps {
  tipo: 'receita' | 'gasto';
  valor: number;
  formatarMoeda: (valor: number) => string;
  mes?: string;
}

export const CardResumo: React.FC<CardResumoProps> = ({ tipo, valor, formatarMoeda, mes }) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const COLORS = getColorsByTheme(isDarkMode);
  const isReceita = tipo === 'receita';
  const iconColor = isReceita ? COLORS.success : COLORS.error;
  
  return (
    <View style={styles.cardResumo}>
      <View style={styles.cardResumoHeader}>
        <View style={styles.cardResumoIcone}>
          <Ionicons 
            name={isReceita ? 'arrow-down-circle' : 'arrow-up-circle'} 
            size={20} 
            color={iconColor} 
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardResumoLabel}>
            {isReceita ? 'Receita' : 'Gastos'}
          </Text>
          {mes ? (
            <Text style={styles.cardResumoMes}>{mes}</Text>
          ) : null}
        </View>
      </View>
      <Text style={styles.cardResumoValor}>
        {formatarMoeda(valor)}
      </Text>
    </View>
  );
};
