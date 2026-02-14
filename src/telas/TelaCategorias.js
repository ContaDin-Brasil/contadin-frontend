import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CategoriesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Categorias</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CategoriesScreen;
