import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import NavegadorPrincipal from "./src/navegacao/NavegadorPrincipal";
import NavegadorAutenticacao from "./src/navegacao/NavegadorAutenticacao";
import { CacheProvider } from "./src/contexts/CacheContext";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

function NavegacaoRaiz() {
  const { token, loading } = useAuth();
  if (!token && !loading) {
    return <NavegadorAutenticacao />;
  }
  return <NavegadorPrincipal />;
}

export default function App() {
  return (
    <CacheProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <NavegacaoRaiz />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </CacheProvider>
  );
}
