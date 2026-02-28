import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaEntradaAuth from '../telas/autenticacoes/login/TelaEntradaAuth';
import TelaLogin from '../telas/autenticacoes/login/TelaLogin';
import TelaLoginSucesso from '../telas/autenticacoes/login/TelaLoginSucesso';
import TelaCriarConta from '../telas/autenticacoes/cadastro/TelaCriarConta';
import TelaBemVindo from '../telas/autenticacoes/cadastro/TelaBemVindo';
import TelaInformacoesPessoais from '../telas/autenticacoes/cadastro/TelaInformacoesPessoais';
import TelaSelecaoBancos from '../telas/autenticacoes/cadastro/TelaSelecaoBancos';
import TelaCadastroInstituicao from '../telas/autenticacoes/cadastro/TelaCadastroInstituicao';
import TelaCadastroSucesso from '../telas/autenticacoes/cadastro/TelaCadastroSucesso';

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
      <Stack.Screen name="Cadastro" component={TelaCriarConta} />
      <Stack.Screen name="BemVindo" component={TelaBemVindo} />
      <Stack.Screen name="InformacoesPessoais" component={TelaInformacoesPessoais} />
      <Stack.Screen name="SelecaoBancos" component={TelaSelecaoBancos} />
      <Stack.Screen name="CadastroInstituicao" component={TelaCadastroInstituicao} />
      <Stack.Screen name="CadastroSucesso" component={TelaCadastroSucesso} />
      <Stack.Screen name="EsqueceuSenha" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

export default NavegadorAutenticacao;
