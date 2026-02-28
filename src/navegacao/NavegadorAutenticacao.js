import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function PlaceholderScreen({ route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{route.name} (placeholder)</Text>
    </View>
  );
}

function NavegadorAutenticacao() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="EntradaAuth" component={PlaceholderScreen} />
      <Stack.Screen name="Login" component={PlaceholderScreen} />
      <Stack.Screen name="Cadastro" component={PlaceholderScreen} />
      <Stack.Screen name="EsqueceuSenha" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

export default NavegadorAutenticacao;
