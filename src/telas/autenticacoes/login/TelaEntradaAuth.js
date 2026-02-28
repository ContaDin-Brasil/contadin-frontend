import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/TelaEntradaAuth.styles";

function TelaEntradaAuth({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoArea}>
        <Text style={styles.logoPlaceholder}>Lorem ipsum</Text>
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
        <TouchableOpacity style={styles.iconeGoogle} activeOpacity={0.8}>
          <Ionicons name="logo-google" size={40} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default TelaEntradaAuth;
