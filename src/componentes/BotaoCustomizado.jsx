import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const CustomButton = ({ title, onPress, variant = 'primary', icon }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        variant === 'danger' && styles.dangerButton,
        variant === 'secondary' && styles.secondaryButton
      ]} 
      onPress={onPress}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[
          styles.buttonText,
          variant === 'danger' && styles.dangerText
        ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#A8D5FF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dangerButton: {
    backgroundColor: '#FF9B9B',
  },
  secondaryButton: {
    backgroundColor: '#E8F4FF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  dangerText: {
    color: '#000',
  },
});

export default CustomButton;
