import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../styles/colors';

// Importar telas
import TelaInicial from '../telas/dashboard/TelaInicial';
import TelaCarteira from '../telas/carteira/TelaCarteira';
import TelaEditarBancos from '../telas/carteira/TelaEditarBancos';
import TelaEditarVales from '../telas/carteira/TelaEditarVales';
import TelaTransacoes from '../telas/transacoes/TelaTransacoes';
import TelaAdicionarTransacao from '../telas/transacoes/TelaAdicionarTransacao';
import TelaEditarTransacao from '../telas/transacoes/TelaEditarTransacao';
import TelaCategorias from '../telas/categorias/TelaCategorias';
import TelaConfiguracoes from '../telas/configuracoes/TelaConfiguracoes';
import TelaEditarPerfil from '../telas/configuracoes/TelaEditarPerfil';
import TelaConta from '../telas/configuracoes/TelaConta';
import TelaAlterarSenha from '../telas/configuracoes/TelaAlterarSenha';
import TelaAjuda from '../telas/configuracoes/TelaAjuda';
import TelaObjetivos from '../telas/configuracoes/TelaObjetivos';
import TelaAdicionarObjetivo from '../telas/configuracoes/TelaAdicionarObjetivo';
import TelaEditarObjetivo from '../telas/configuracoes/TelaEditarObjetivo';
import TelaImportarPlanilha from '../telas/importacao/TelaImportarPlanilha';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navegador de Configurações
function NavegadorConfiguracoes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SettingsMain" component={TelaConfiguracoes} />
      <Stack.Screen name="EditProfile" component={TelaEditarPerfil} />
      <Stack.Screen name="Account" component={TelaConta} />
      <Stack.Screen name="ChangePassword" component={TelaAlterarSenha} />
      <Stack.Screen name="Help" component={TelaAjuda} />
      <Stack.Screen name="Objectives" component={TelaObjetivos} />
      <Stack.Screen name="ObjectivesAdd" component={TelaAdicionarObjetivo} />
      <Stack.Screen name="ObjectivesEdit" component={TelaEditarObjetivo} />
      <Stack.Screen name="ImportarPlanilha" component={TelaImportarPlanilha} />
    </Stack.Navigator>
  );
}

// Navegador de Carteira
function NavegadorCarteira() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WalletMain" component={TelaCarteira} />
      <Stack.Screen name="EditBanks" component={TelaEditarBancos} />
      <Stack.Screen name="EditVouchers" component={TelaEditarVales} />
    </Stack.Navigator>
  );
}

// Navegador de Transações
function NavegadorTransacoes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TransactionsMain" component={TelaTransacoes} />
      <Stack.Screen name="AdicionarTransacao" component={TelaAdicionarTransacao} />
      <Stack.Screen name="EditarTransacao" component={TelaEditarTransacao} />
    </Stack.Navigator>
  );
}

// Navegador Principal de Abas
function NavegadorPrincipal() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.primaryLight,
          height: 55 + insets.bottom, 
          paddingBottom: 0 + insets.bottom,
          paddingTop: 10,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={TelaInicial}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={NavegadorCarteira}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={NavegadorTransacoes}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'cash' : 'cash-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Categories" 
        component={TelaCategorias}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={NavegadorConfiguracoes}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default NavegadorPrincipal;
