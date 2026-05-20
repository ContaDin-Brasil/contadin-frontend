import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { MaterialIcons } from '@expo/vector-icons';
import type { GastoCategoria } from '../types/dashboard.types';
import { styles } from '../styles/TelaInicial.styles';


interface ModalGraficoCategoriaProps {
  visible: boolean;
  onClose: () => void;
  dados: GastoCategoria[];
  formatarMoeda: (valor: number) => string;
}

export const ModalGraficoCategorias: React.FC<ModalGraficoCategoriaProps> = ({
  visible,
  onClose,
  dados,
  formatarMoeda,
}) => {
  // Filtra apenas categorias com gasto positivo para o gráfico
  const dadosPositivos = dados.filter(cat => cat.valor > 0);

  const totalPositivo = dadosPositivos.reduce((acc, cat) => acc + cat.valor, 0);

  const dadosPizza = dadosPositivos.map(cat => {
    const pct = Math.round((cat.valor / totalPositivo) * 100);
    return {
      value: cat.valor,
      color: cat.cor || '#999999',
      // Só exibe texto na fatia se tiver espaço suficiente (>= 8%)
      text: pct >= 8 ? `${pct}%` : '',
      textColor: '#FFFFFF',
      textSize: 12,
    };
  });

  // Se não houver dados positivos, usa todos
  const dadosExibir = dadosPizza.length > 0 ? dadosPizza : dados.map(cat => ({
    value: Math.abs(cat.valor) || 1,
    color: cat.cor || '#999999',
    text: '',
    textColor: '#FFFFFF',
    textSize: 12,
  }));

  const legendaItens = dadosPositivos.length > 0 ? dadosPositivos : dados;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlayStyle}>
        <View style={styles.modalStyle}>
          <TouchableOpacity style={styles.closeButtonStyle} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#333333" />
          </TouchableOpacity>

          <Text style={styles.titleStyle}>Gastos por Categoria</Text>

          <View style={styles.chartWrapperStyle}>
            <PieChart
              data={dadosExibir}
              donut
              radius={90}
              innerRadius={48}
              showText
              textColor="#FFFFFF"
              textSize={12}
              focusOnPress
            />
          </View>

          <View style={styles.legendaGridStyle}>
            {legendaItens.map(cat => {
              const pct = totalPositivo > 0
                ? Math.round((cat.valor / totalPositivo) * 100)
                : 0;
              return (
                <View key={cat.id} style={styles.legendaItemStyle}>
                  <View style={[styles.legendaCorStyle, { backgroundColor: cat.cor || '#999999' }]} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={styles.legendaNomeStyle} numberOfLines={1}>{cat.nome}</Text>
                      <Text style={styles.legendaPctStyle}>{pct}%</Text>
                    </View>
                    <Text style={styles.legendaValorStyle}>{formatarMoeda(cat.valor)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};
