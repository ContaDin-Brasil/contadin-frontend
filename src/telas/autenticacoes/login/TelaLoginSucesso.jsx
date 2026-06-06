import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { getColorsByTheme } from "../../../styles/colors";
import { getStyles } from "./styles/TelaLoginSucesso.styles";

function TelaLoginSucesso({ route, navigation }) {
  const { loginWithToken } = useAuth();
  const token = route.params?.token;
  const user = route.params?.user;
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getStyles(isDarkMode);

  const onComecarAContar = async () => {
    if (token) {
      await loginWithToken(token, user ?? undefined);
    }
    // App re-renderiza ao setar token e exibe NavegadorPrincipal
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconeSucesso}>
        <Ionicons name="checkmark-circle-outline" size={80} color={COLORS.primary} />
      </View>
      <Text style={styles.textoSucesso}>Login efetuado com sucesso!</Text>
      <TouchableOpacity
        style={styles.botaoContinuar}
        onPress={onComecarAContar}
        activeOpacity={0.8}
      >
        <Text style={styles.botaoContinuarText}>Começar a contar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoImportar}
        onPress={() =>
          navigation.navigate('ImportarPlanilha', {
            token,
            user,
            fromLoginSuccess: true,
          })
        }
        activeOpacity={0.8}
      >
        <Text style={styles.botaoImportarText}>Importar planilha (opcional)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default TelaLoginSucesso;
