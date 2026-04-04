import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable, Platform } from 'react-native';
import { COLORS } from '../../styles/colors';

const ModalAviso = ({ 
  visible, 
  onClose, 
  titulo = 'Aviso', 
  mensagem,
  textoOk = 'OK',
}) => {
  if (!visible) return null;

  // Para web, usa um componente diferente que funciona melhor
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webOverlay}>
        <View style={styles.webModalContainer}>
          <Text style={styles.title}>{titulo}</Text>
          <View style={styles.content}>
            <Text style={styles.mensagem}>{mensagem}</Text>
          </View>
          <TouchableOpacity 
            style={styles.okButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.okButtonText}>{textoOk}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Para mobile (React Native)
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>{titulo}</Text>
          <View style={styles.content}>
            <Text style={styles.mensagem}>{mensagem}</Text>
          </View>
          <TouchableOpacity 
            style={styles.okButton}
            onPress={onClose}
          >
            <Text style={styles.okButtonText}>{textoOk}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Estilos para Web
  webOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  webModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    maxWidth: 400,
    width: '90%',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  },
  // Estilos para Mobile
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    minHeight: 200,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.textPale,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.black,
  },
  content: {
    marginBottom: 24,
  },
  mensagem: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  okButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  okButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ModalAviso;
