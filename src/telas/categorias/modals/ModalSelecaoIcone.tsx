import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CATEGORY_ICONS } from '../constants/constantesCategorias';
import { getColorsByTheme } from '../../../styles/colors';
import { useTheme } from '../../../contexts/ThemeContext';
import { getStyles } from '../style/ModalSelecaoIcone.style';

interface ModalSelecaoIconeProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (icon: string) => void;
  selectedIcon?: string;
}

const ModalSelecaoIcone: React.FC<ModalSelecaoIconeProps> = ({
  visible,
  onClose,
  onSelect,
  selectedIcon,
}) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const COLORS = getColorsByTheme(isDarkMode);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          
          <Text style={styles.title}>Selecione um ícone</Text>
          
          <FlatList
            data={CATEGORY_ICONS}
            keyExtractor={(item) => item}
            numColumns={5}
            contentContainerStyle={styles.iconGrid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  selectedIcon === item && styles.iconButtonSelected,
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <MaterialIcons
                  name={item as any}
                  size={28}
                  color={selectedIcon === item ? COLORS.white : COLORS.textPrimary}
                />
              </TouchableOpacity>
            )}
          />
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};


export default ModalSelecaoIcone;
