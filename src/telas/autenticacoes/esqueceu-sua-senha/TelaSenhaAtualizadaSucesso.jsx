import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/TelaSenhaAtualizadaSucesso.styles";

function TelaSenhaAtualizadaSucesso({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-open-outline" size={48} color="#333" />
        </View>
        <Text style={styles.mensagemSucesso}>
          Senha atualizada com sucesso!
        </Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.replace("Login")}
          activeOpacity={0.8}
        >
          <Ionicons name="log-in-outline" size={24} color="#FFF" />
          <Text style={styles.saveButtonText}>Efetuar Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default TelaSenhaAtualizadaSucesso;
