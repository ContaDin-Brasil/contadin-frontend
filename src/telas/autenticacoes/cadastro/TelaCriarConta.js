import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TituloPagina from "../../../componentes/TituloPagina";
import { useCriarConta } from "./hooks/useCriarConta";
import { styles } from "./styles/TelaCriarConta.styles";

function TelaCriarConta({ navigation }) {
  const criar = useCriarConta();

  const onCadastrar = async () => {
    await criar.handleCadastrar(navigation);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina
        mostrarBotaoVoltar={true}
        onVoltar={() => navigation.goBack()}
      >
        Crie sua conta
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={criar.email}
            onChangeText={criar.setEmail}
            placeholder=""
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!criar.loading}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={criar.senha}
            onChangeText={criar.setSenha}
            secureTextEntry
            placeholder=""
            editable={!criar.loading}
          />

          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput
            style={styles.input}
            value={criar.confirmarSenha}
            onChangeText={criar.setConfirmarSenha}
            secureTextEntry
            placeholder=""
            editable={!criar.loading}
          />

          <View style={styles.termosContainer}>
            <Switch
              value={criar.aceiteTermos}
              onValueChange={criar.setAceiteTermos}
              trackColor={{ false: "#D3D3D3", true: "#6BA7FF" }}
              thumbColor={criar.aceiteTermos ? "#FFF" : "#f4f3f4"}
            />
            <Text style={styles.termosTexto}>
              Li e aceito os{" "}
              <Text style={styles.termosLink}>termos de serviço</Text> e a{" "}
              <Text style={styles.termosLink}>política de privacidade</Text>.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={onCadastrar}
            disabled={criar.loading}
          >
            <Text style={styles.saveButtonText}>
              {criar.loading ? "Cadastrando..." : "Cadastrar-se"}
            </Text>
          </TouchableOpacity>

          {criar.error ? (
            <Text style={styles.mensagemErro}>{criar.error}</Text>
          ) : null}
        </View>

        <View style={styles.areaGoogle}>
          <Text style={styles.ouConecte}>Ou conecte-se com</Text>
          <TouchableOpacity style={styles.botaoGoogle} activeOpacity={0.8}>
            <Ionicons name="logo-google" size={24} color="#333" />
            <Text style={styles.botaoGoogleText}>Google</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.linkLogin}>
          Já possui conta?{" "}
          <Text
            style={styles.linkLoginDestaque}
            onPress={() => navigation.navigate("Login")}
          >
            Efetue seu login
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TelaCriarConta;
