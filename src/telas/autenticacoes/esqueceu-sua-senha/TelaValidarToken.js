import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TituloPagina from '../../componentes/TituloPagina';
import { useValidarToken } from './hooks/useValidarToken';
import { styles } from './styles/TelaValidarToken.styles';

const PIN_LENGTH = 6;

function TelaValidarToken({ navigation, route }) {
  const email = route.params?.email ?? '';
  const validar = useValidarToken(email);
  const inputRefs = useRef([]);

  const onValidar = () => {
    const ok = validar.handleValidar();
    if (ok) {
      navigation.navigate('NovaSenha', { email, token: validar.token });
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
          <View style={styles.pinRow}>
            {validar.pinDigits.map((digit, index) => (
              <TextInput
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                style={styles.pinInput}
                value={digit}
                onChangeText={v => {
                  validar.setPinDigit(index, v);
                  if (v) focusNext(index);
                }}
                onKeyPress={e => {
                  if (e.nativeEvent.key === 'Backspace' && !digit) {
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
              {validar.countdown > 0 ? ` ${validar.countdown}s` : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={onValidar}
            disabled={validar.loading}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="#000" />
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
