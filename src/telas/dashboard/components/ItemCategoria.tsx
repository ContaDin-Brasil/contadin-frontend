import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/TelaInicial.styles';
import type { GastoCategoria } from '../types/dashboard.types';

interface ItemCategoriaProps {
  categoria: GastoCategoria;
  formatarMoeda: (valor: number) => string;
}

export const ItemCategoria: React.FC<ItemCategoriaProps> = ({ categoria, formatarMoeda }) => {
  return (
    <View style={styles.itemCategoria}>
      <View style={styles.itemCategoriaHeader}>
        <View style={[styles.itemCategoriaIcone, { backgroundColor: categoria.cor + '20' }]}>
          <MaterialIcons name={categoria.icone as any} size={20} color={categoria.cor} />
        </View>
        <View style={styles.itemCategoriaInfo}>
          <Text style={styles.itemCategoriaNome}>{categoria.nome}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.itemCategoriaValor}>{formatarMoeda(categoria.valor)}</Text>
          <Text style={styles.itemCategoriaPorcentagem}>{categoria.porcentagem}%</Text>
        </View>
      </View>
      <View style={styles.barraProgresso}>
        <View 
          style={[
            styles.barraProgressoPreenchida, 
            { 
              width: `${categoria.porcentagem}%`,
              backgroundColor: categoria.cor,
            }
          ]} 
        />
      </View>
    </View>
  );
};
