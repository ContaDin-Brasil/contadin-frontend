import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import NavegadorPrincipal from './src/navegacao/NavegadorPrincipal';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <NavegadorPrincipal />
    </NavigationContainer>
  );
}
