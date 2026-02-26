import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import NavegadorPrincipal from "./src/navegacao/NavegadorPrincipal";
import { CacheProvider } from "./src/contexts/CacheContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <CacheProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <NavegadorPrincipal />
        </NavigationContainer>
      </SafeAreaProvider>
    </CacheProvider>
  );
}
