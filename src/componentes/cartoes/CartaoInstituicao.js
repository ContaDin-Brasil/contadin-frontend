import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InstitutionCard = ({
  name,
  balance,
  icon,
  color = '#999',
  onPress,
  variant = 'grid' // 'grid', 'list', or 'carousel'
}) => {
  if (variant === 'carousel') {
    return (
      <TouchableOpacity
        style={[styles.carouselCard, { borderColor: color, borderWidth: 3 }]}
        onPress={onPress}
      >
        <View style={styles.carouselCardContent}>
          <View style={styles.carouselTopRow}>
            <View style={[styles.carouselIconContainer, { backgroundColor: color }]}>
              {icon}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.carouselName}>{name}</Text>
              <Text style={styles.carouselBalance}>Saldo Atual: {balance}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'list') {
    return (
      <TouchableOpacity
        style={[styles.listCard, { borderLeftColor: color, borderLeftWidth: 0 }]}
        onPress={onPress}
      >
        <View style={styles.listCardContent}>
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            {icon}
          </View>
          <View style={styles.listInfo}>
            <Text style={styles.listName}>{name}</Text>
            <Text style={styles.listBalance}>Saldo Atual: {balance}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Grid variant
  return (
    <TouchableOpacity
      style={[styles.gridCard, { borderColor: color, borderWidth: 3 }]}
      onPress={onPress}
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

const AddCard = ({ onPress, variant = 'grid' }) => {
  if (variant === 'carousel') {
    return (
      <TouchableOpacity style={styles.addCarouselCard} onPress={onPress}>
        <Ionicons name="add" size={56} color="#999" />
        <Text style={styles.addCarouselText}>Adicionar</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'grid') {
    return (
      <TouchableOpacity style={styles.addGridCard} onPress={onPress}>
        <Ionicons name="add" size={48} color="#999" />
      </TouchableOpacity>
    );
  }
  return null;
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

  // List styles
  listCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  listCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  listBalance: {
    fontSize: 12,
    color: '#666',
  },

  // Carousel styles
  carouselCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '0%',
    minHeight: 130,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  carouselCardContent: {
    justifyContent: 'space-between',
    flex: 1,
  },
  carouselTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  carouselIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  carouselName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },
  carouselBalance: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  addCarouselCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    padding: 20,
    width: '100%',
    minHeight: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCarouselText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
    marginTop: 12,
  },
});

export { InstitutionCard, AddCard };
export default InstitutionCard;
