import React from "react";
import "./i18n";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import NavegadorPrincipal from "./src/navegacao/NavegadorPrincipal";
import NavegadorAutenticacao from "./src/navegacao/NavegadorAutenticacao";
import { CacheProvider } from "./src/contexts/CacheContext";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
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
    <ThemeProvider>
      <CacheProvider>
        <AuthProvider>
          <StatusBar 
            barStyle="dark-content" 
            backgroundColor="#FFFFFF"
            translucent={false}
          />
          <SafeAreaProvider>
            <NavigationContainer>
              <NavegacaoRaiz />
            </NavigationContainer>
            <Toast />
          </SafeAreaProvider>
        </AuthProvider>
      </CacheProvider>
    </ThemeProvider>
  );
}
