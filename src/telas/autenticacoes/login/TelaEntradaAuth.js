import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "@assets/logos/contadin/LogoContadinDefault.svg";
import { styles } from "./styles/TelaEntradaAuth.styles";

function TelaEntradaAuth({ navigation }) {
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

      <View style={styles.areaGoogle}>
        <Text style={styles.ouConecte}>Ou conecte-se com</Text>
        <TouchableOpacity style={styles.botaoGoogle} activeOpacity={0.8}>
          <Ionicons name="logo-google" size={24} color="#333" />
          <Text style={styles.botaoGoogleText}>Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default TelaEntradaAuth;
