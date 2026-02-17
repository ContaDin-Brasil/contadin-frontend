import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import NavegadorPrincipal from './src/navegacao/NavegadorPrincipal';
import { CacheProvider } from './src/contexts/CacheContext';

export default function App() {
  return (
    <CacheProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <NavegadorPrincipal />
      </NavigationContainer>
    </CacheProvider>
  );
}
