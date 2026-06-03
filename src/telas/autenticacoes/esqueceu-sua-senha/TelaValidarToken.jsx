import React, { useRef } from "react";
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
import { useValidarToken } from "./hooks/useValidarToken";
import { useTheme } from "../../../contexts/ThemeContext";
import { getColorsByTheme } from "../../../styles/colors";
import { getStyles } from "./styles/TelaValidarToken.styles";

const PIN_LENGTH = 6;

function TelaValidarToken({ navigation, route }) {
  const email = route.params?.email ?? "";
  const validar = useValidarToken(email);
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const styles = getStyles(isDarkMode);
  const inputRefs = useRef([]);

  const onValidar = async () => {
    const ok = await validar.handleValidar();
    if (ok) {
      navigation.navigate("NovaSenha", { email, token: validar.token });
    }
  };

  const focusNext = (index) => {
    if (index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrev = (index) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TituloPagina
        mostrarBotaoVoltar={true}
        onVoltar={() => navigation.goBack()}
      >
        Insira o PIN enviado por email.
      </TituloPagina>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.infoMessage}>
            Se este email estiver cadastrado em nossa plataforma, você receberá um código de 6 dígitos. Digite-o abaixo para prosseguir com a recuperação de sua senha.
          </Text>
          <View style={styles.pinRow}>
            {validar.pinDigits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                style={styles.pinInput}
                value={digit}
                onChangeText={(v) => {
                  validar.setPinDigit(index, v);
                  if (v) focusNext(index);
                }}
                onKeyPress={(e) => {
                  if (e.nativeEvent.key === "Backspace" && !digit) {
                    focusPrev(index);
                  }
                }}
                keyboardType="number-pad"
                maxLength={index === 0 ? 6 : 1}
                selectTextOnFocus
                editable={!validar.loading}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.linkReenviar}
            onPress={validar.handleReenviar}
            disabled={!validar.podeReenviar || validar.loading}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.linkReenviarText,
                !validar.podeReenviar && styles.linkReenviarDisabled,
              ]}
            >
              Enviar código novamente
              {validar.countdown > 0 ? ` ${validar.countdown}s` : ""}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={onValidar}
            disabled={validar.loading}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.white} />
            <Text style={styles.saveButtonText}>Validar Código</Text>
          </TouchableOpacity>
          {validar.error ? (
            <Text style={styles.mensagemErro}>{validar.error}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default TelaValidarToken;
