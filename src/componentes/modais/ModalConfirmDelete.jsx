import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator, Platform } from 'react-native';

const ModalConfirmDelete = ({ 
  visible, 
  onClose, 
  titulo = 'Confirmar exclusão', 
  mensagem, 
  onConfirm, 
  textoCancelar = 'Cancelar',
  textoConfirmar = 'Excluir',
  isLoading = false 
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.cancelButton, isLoading && styles.buttonDisabled]} 
              onPress={onClose}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{textoCancelar}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmButton, isLoading && styles.buttonDisabled]} 
              onPress={onConfirm}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.confirmButtonText}>{textoConfirmar}</Text>
              )}
            </TouchableOpacity>
          </View>
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.cancelButton, isLoading && styles.buttonDisabled]} 
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>{textoCancelar}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmButton, isLoading && styles.buttonDisabled]} 
              onPress={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.confirmButtonText}>{textoConfirmar}</Text>
              )}
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  webModalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    maxWidth: 400,
    width: '90%',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  },
  // Estilos para Mobile
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    minHeight: 200,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  content: {
    marginBottom: 24,
  },
  mensagem: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default ModalConfirmDelete;
