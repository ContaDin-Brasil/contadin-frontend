import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InstitutionCard = ({
  name,
  balance,
  icon,
  color = '#999',
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.gridCard, { borderColor: color, borderWidth: 3 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.gridCardContent}>
        <View style={styles.gridCardRow}>
          <View style={[styles.gridIconContainer, { backgroundColor: color }]}>
            {icon}
          </View>
          <Text style={styles.gridName}>{name}</Text>
        </View>
        <Text style={styles.gridBalance}>Saldo Atual: {balance}</Text>
      </View>
    </TouchableOpacity>
  );
};

const AddCard = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.addGridCard} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name="add" size={48} color="#999" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Grid styles
  gridCard: {
    backgroundColor: '#FFF',
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
    marginBottom: 12,
  },
  gridName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  gridBalance: {
    fontSize: 13,
    color: '#666',
  },
  addGridCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
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
export default InstitutionCard;
