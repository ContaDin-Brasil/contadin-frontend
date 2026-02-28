import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TituloPagina from "../../../componentes/TituloPagina";
import { useLogin } from "./hooks/useLogin";
import { styles } from "./styles/TelaLogin.styles";

function TelaLogin({ navigation }) {
  const login = useLogin();

  const onLogin = async () => {
    const result = await login.handleLogin();
    if (result.success) {
      navigation.replace("LoginSucesso", {
        token: result.token,
        user: result.user,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina
        mostrarBotaoVoltar={true}
        onVoltar={() => navigation.goBack()}
      >
        Bem vindo de volta!
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={login.email}
            onChangeText={login.setEmail}
            placeholder=""
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!login.loading}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={login.senha}
            onChangeText={login.setSenha}
            secureTextEntry
            placeholder=""
            editable={!login.loading}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={onLogin}
            disabled={login.loading}
          >
            <Ionicons name="log-in-outline" size={24} color="#000" />
            <Text style={styles.saveButtonText}>
              {login.loading ? "Entrando..." : "Login"}
            </Text>
          </TouchableOpacity>

          {login.error ? (
            <Text style={styles.mensagemErro}>{login.error}</Text>
          ) : null}

          <TouchableOpacity
            onPress={() => navigation.navigate("SolicitarEmail")}
            activeOpacity={0.8}
          >
            <Text style={styles.linkTexto}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.areaGoogle}>
          <Text style={styles.ouConecte}>Ou conecte-se:</Text>
          <TouchableOpacity style={styles.iconeGoogle} activeOpacity={0.8}>
            <Ionicons name="logo-google" size={40} color="#333" />
          </TouchableOpacity>
        </View>

        <Text style={styles.linkCadastro}>
          Ainda não possui conta?{" "}
          <Text
            style={styles.linkCadastroDestaque}
            onPress={() => navigation.navigate("Cadastro")}
          >
            Crie uma agora!
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TelaLogin;
