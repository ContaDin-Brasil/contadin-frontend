import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/TelaInicial.styles';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home</Text>
    </View>
  );
};

export default HomeScreen;
