import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import Logo from "@assets/logos/contadin/LogoContadinDefault.svg";
import { useTheme } from "../../../contexts/ThemeContext";
import { getStyles } from "./styles/TelaEntradaAuth.styles";

function TelaEntradaAuth({ navigation }) {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoArea}>
        <Logo width={160} height={160} />
      </View>

      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => navigation.navigate("Cadastro")}
          activeOpacity={0.8}
        >
          <Text style={styles.botaoSecundarioText}>Cadastrar-se</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoPrimario}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.8}
        >
          <Text style={styles.botaoPrimarioText}>Login</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("SolicitarEmail")}
        activeOpacity={0.8}
      >
        <Text style={styles.linkTexto}>Esqueceu a senha?</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

export default TelaEntradaAuth;
