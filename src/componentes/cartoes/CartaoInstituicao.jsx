import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLogoByName } from '../modais/logosInstituicoes';
import { useTheme } from '../../contexts/ThemeContext';
import { getColorsByTheme } from '../../styles/colors';

const InstitutionCard = ({
  name,
  balance,
  icon,
  color = '#999',
  onPress,
}) => {
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);
  const logo = getLogoByName(name);
  
  return (
    <TouchableOpacity
      style={[
        styles.gridCard,
        {
          backgroundColor: COLORS.cardBg,
          borderColor: color,
          borderWidth: 3,
          shadowColor: COLORS.black,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.gridCardContent}>
        <View style={styles.gridCardRow}>
          <View
            style={[
              styles.gridIconContainer,
              { backgroundColor: logo ? COLORS.backgroundLight : color },
            ]}
          >
            {logo ? (
              <Image 
                source={logo} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            ) : (
              icon
            )}
          </View>
          <Text style={[styles.gridName, { color: COLORS.textPrimary }]}>{name}</Text>
        </View>
        <Text style={[styles.gridBalance, { color: COLORS.textSecondary }]}>Saldo Atual:{'\n'}{balance}</Text>
      </View>
    </TouchableOpacity>
  );
};

const AddCard = ({ onPress }) => {
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);

  return (
    <TouchableOpacity
      style={[
        styles.addGridCard,
        {
          backgroundColor: COLORS.backgroundLight,
          borderColor: COLORS.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="add" size={48} color={COLORS.textTertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Grid styles
  gridCard: {
    borderRadius: 16,
    padding: 8,
    width: '48%',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gridCardRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 12,
  },
  gridCardContent: {
    alignItems: 'flex-start',
  },
  gridIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 36,
    height: 36,
    objectFit: 'cover',
    borderRadius: 8,
  },
  gridName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
    flexWrap: 'wrap',
    flex: 1,
  },
  gridBalance: {
    fontSize: 13,
    color: '#666',
  },
  addGridCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 16,
    width: '48%',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'auto',
  },
});

export { InstitutionCard, AddCard };
