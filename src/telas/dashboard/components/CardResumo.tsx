import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/TelaInicial.styles';

interface CardResumoProps {
  tipo: 'receita' | 'gasto';
  valor: number;
  formatarMoeda: (valor: number) => string;
  mes?: string;
}

export const CardResumo: React.FC<CardResumoProps> = ({ tipo, valor, formatarMoeda, mes }) => {
  const isReceita = tipo === 'receita';
  
  return (
    <View style={styles.cardResumo}>
      <View style={styles.cardResumoHeader}>
        <View style={styles.cardResumoIcone}>
          <Ionicons 
            name={isReceita ? 'arrow-down-circle' : 'arrow-up-circle'} 
            size={20} 
            color={isReceita ? '#4CAF50' : '#E31C23'} 
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
