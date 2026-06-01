import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getColorsByTheme } from '../../styles/colors';

const CustomModal = ({
  visible,
  onClose,
  title,
  children,
  showButtons = true,
  onConfirm,
  confirmText = 'Continuar',
  cancelText = 'Cancelar',
  confirmVariant = 'danger',
  confirmColor,
}) => {
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);

  const resolvedConfirmColor = confirmColor
    ? confirmColor
    : confirmVariant === 'success'
      ? COLORS.success
      : confirmVariant === 'primary'
        ? COLORS.primary
        : COLORS.error;
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={[getStyles(isDarkMode).overlay]} onPress={onClose}>
        <Pressable style={[getStyles(isDarkMode).modalContainer]} onPress={(e) => e.stopPropagation()}>
          <View style={getStyles(isDarkMode).handle} />
          <Text style={getStyles(isDarkMode).title}>{title}</Text>
          <View style={getStyles(isDarkMode).content}>
            {children}
          </View>
          {showButtons && (
            <View style={getStyles(isDarkMode).buttonContainer}>
              <TouchableOpacity style={getStyles(isDarkMode).cancelButton} onPress={onClose}>
                <Text style={getStyles(isDarkMode).cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[getStyles(isDarkMode).confirmButton, { backgroundColor: resolvedConfirmColor }]}
                onPress={onConfirm}
              >
                <Text style={getStyles(isDarkMode).confirmButtonText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const getStyles = (isDarkMode) => {
  const COLORS = getColorsByTheme(isDarkMode);
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: COLORS.overlay,
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: COLORS.backgroundLight,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
      minHeight: 200,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: COLORS.border,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: COLORS.textPrimary,
    },
    content: {
      marginBottom: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: COLORS.background,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: COLORS.textSecondary,
      fontSize: 16,
      fontWeight: '600',
    },
    confirmButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: '600',
    },
  });
};

export default CustomModal;
