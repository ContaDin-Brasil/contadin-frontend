import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { MaterialIcons } from '@expo/vector-icons';
import type { SaldoInstituicao } from '../types/dashboard.types';
import { styles } from '../styles/TelaInicial.styles';


interface ModalGraficoPizzaProps {
  visible: boolean;
  onClose: () => void;
  dados: SaldoInstituicao[];
  formatarMoeda: (valor: number) => string;
}

export const ModalGraficoPizza: React.FC<ModalGraficoPizzaProps> = ({
  visible,
  onClose,
  dados,
  formatarMoeda,
}) => {
  // Filtra apenas instituições com saldo positivo para o gráfico
  const dadosPositivos = dados.filter(inst => inst.valor > 0);

  const totalPositivo = dadosPositivos.reduce((acc, inst) => acc + inst.valor, 0);

  const dadosPizza = dadosPositivos.map(inst => {
    const pct = Math.round((inst.valor / totalPositivo) * 100);
    return {
      value: inst.valor,
      color: inst.cor || '#999999',
      // Só exibe texto na fatia se tiver espaço suficiente (>= 8%)
      text: pct >= 8 ? `${pct}%` : '',
      textColor: '#FFFFFF',
      textSize: 12,
    };
  });

  // Se não houver dados positivos, usa todos
  const dadosExibir = dadosPizza.length > 0 ? dadosPizza : dados.map(inst => ({
    value: Math.abs(inst.valor) || 1,
    color: inst.cor || '#999999',
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

          <Text style={styles.titleStyle}>Saldo por Instituição</Text>

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
            {legendaItens.map(inst => {
              const pct = totalPositivo > 0
                ? Math.round((inst.valor / totalPositivo) * 100)
                : 0;
              return (
                <View key={inst.id} style={styles.legendaItemStyle}>
                  <View style={[styles.legendaCorStyle, { backgroundColor: inst.cor || '#999999' }]} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={styles.legendaNomeStyle} numberOfLines={1}>{inst.nome}</Text>
                      <Text style={styles.legendaPctStyle}>{pct}%</Text>
                    </View>
                    <Text style={styles.legendaValorStyle}>{formatarMoeda(inst.valor)}</Text>
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

