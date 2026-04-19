import React from 'react';
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
import TelaSolicitarEmail from '../telas/autenticacoes/esqueceu-sua-senha/TelaSolicitarEmail';
import TelaValidarToken from '../telas/autenticacoes/esqueceu-sua-senha/TelaValidarToken';
import TelaNovaSenha from '../telas/autenticacoes/esqueceu-sua-senha/TelaNovaSenha';
import TelaSenhaAtualizadaSucesso from '../telas/autenticacoes/esqueceu-sua-senha/TelaSenhaAtualizadaSucesso';
import TelaImportarPlanilha from '../telas/importacao/TelaImportarPlanilha';

const Stack = createStackNavigator();

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
      <Stack.Screen name="SolicitarEmail" component={TelaSolicitarEmail} />
      <Stack.Screen name="ValidarToken" component={TelaValidarToken} />
      <Stack.Screen name="NovaSenha" component={TelaNovaSenha} />
      <Stack.Screen name="SenhaAtualizadaSucesso" component={TelaSenhaAtualizadaSucesso} />
      <Stack.Screen name="ImportarPlanilha" component={TelaImportarPlanilha} />
    </Stack.Navigator>
  );
}

export default NavegadorAutenticacao;
