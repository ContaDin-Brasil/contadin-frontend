import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaEntradaAuth from '../telas/autenticacoes/login/TelaEntradaAuth';
import TelaLogin from '../telas/autenticacoes/login/TelaLogin';
import TelaLoginSucesso from '../telas/autenticacoes/login/TelaLoginSucesso';

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
      initialRouteName="EntradaAuth"
    >
      <Stack.Screen name="EntradaAuth" component={TelaEntradaAuth} />
      <Stack.Screen name="Login" component={TelaLogin} />
      <Stack.Screen name="LoginSucesso" component={TelaLoginSucesso} />
      <Stack.Screen name="Cadastro" component={PlaceholderScreen} />
      <Stack.Screen name="EsqueceuSenha" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

export default NavegadorAutenticacao;
