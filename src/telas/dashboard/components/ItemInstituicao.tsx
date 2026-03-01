import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/TelaInicial.styles';
import type { SaldoInstituicao } from '../types/dashboard.types';
import { getLogoByName } from '../../../componentes/modais/logosInstituicoes';

interface ItemInstituicaoProps {
  instituicao: SaldoInstituicao;
  formatarMoeda: (valor: number) => string;
  onPress?: () => void;
}

export const ItemInstituicao: React.FC<ItemInstituicaoProps> = ({ instituicao, formatarMoeda, onPress }) => {
  const logo = getLogoByName(instituicao.nome);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.itemInstituicao, { borderLeftWidth: 4, borderLeftColor: instituicao.cor }]}
    >
      <View style={styles.itemInstituicaoHeader}>
        <View style={[styles.itemInstituicaoIcone, { backgroundColor: logo ? '#FFF' : instituicao.cor }]}>
          {logo ? (
            <Image source={logo} style={styles.itemInstituicaoLogo} resizeMode="contain" />
          ) : (
            <Text style={styles.itemInstituicaoTextoIcone}>{instituicao.icone}</Text>
          )}
        </View>
        <View style={styles.itemInstituicaoInfo}>
          <Text style={styles.itemInstituicaoNome}>{instituicao.nome}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.itemInstituicaoValor}>{formatarMoeda(instituicao.valor)}</Text>
          <Text style={styles.itemInstituicaoPorcentagem}>{instituicao.porcentagem}%</Text>
        </View>
      </View>
      <View style={styles.barraProgresso}>
        <View 
          style={[
            styles.barraProgressoPreenchida, 
            { 
              width: `${instituicao.porcentagem}%`,
              backgroundColor: instituicao.cor,
            }
          ]} 
        />
      </View>
    </TouchableOpacity>
  );
};
