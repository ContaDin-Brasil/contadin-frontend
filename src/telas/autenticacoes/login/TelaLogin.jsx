import React, { useState } from "react";
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
  const [mostrarSenha, setMostrarSenha] = useState(false);

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
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputComIcone]}
              value={login.senha}
              onChangeText={login.setSenha}
              secureTextEntry={!mostrarSenha}
              placeholder=""
              editable={!login.loading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setMostrarSenha((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={onLogin}
            disabled={login.loading}
          >
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
          <Text style={styles.ouConecte}>Ou conecte-se com</Text>
          <TouchableOpacity style={styles.botaoGoogle} activeOpacity={0.8}>
            <Ionicons name="logo-google" size={24} color="#333" />
            <Text style={styles.botaoGoogleText}>Google</Text>
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
