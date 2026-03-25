import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';

export const FOOTER_HEIGHT = 8;

const BotoesAcaoFixo = ({
  primaryLabel,
  primaryLoadingLabel,
  onPrimaryPress,
  primaryDisabled = false,
  primaryLoading = false,
  secondaryLabel,
  secondaryLoadingLabel,
  onSecondaryPress,
  secondaryDisabled = false,
  secondaryLoading = false,
  secondaryVariant = 'cancel',
}) => {
  const hasSecondary = Boolean(secondaryLabel);
  const primaryText = primaryLoading && primaryLoadingLabel ? primaryLoadingLabel : primaryLabel;
  const secondaryText = secondaryLoading && secondaryLoadingLabel ? secondaryLoadingLabel : secondaryLabel;

  return (
    <View style={styles.footer}>
      <View style={hasSecondary ? styles.row : styles.singleRow}>
        {hasSecondary && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              secondaryVariant === 'danger' && styles.secondaryDanger,
              (secondaryDisabled || secondaryLoading) && styles.buttonDisabled,
              hasSecondary && styles.buttonHalf,
            ]}
            onPress={onSecondaryPress}
            disabled={secondaryDisabled || secondaryLoading}
          >
            {secondaryLoading ? (
              <ActivityIndicator size="small" color={secondaryVariant === 'danger' ? COLORS.error : COLORS.textPrimary} />
            ) : null}
            <Text
              style={[
                styles.secondaryText,
                secondaryVariant === 'danger' && styles.secondaryDangerText,
              ]}
            >
              {secondaryText}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            (primaryDisabled || primaryLoading) && styles.buttonDisabled,
            hasSecondary ? styles.buttonHalf : styles.buttonFull,
          ]}
          onPress={onPrimaryPress}
          disabled={primaryDisabled || primaryLoading}
        >
          {primaryLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : null}
          <Text style={styles.primaryText}>{primaryText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  singleRow: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexDirection: 'row',
  },
  buttonHalf: {
    flex: 1,
  },
  buttonFull: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryDanger: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FFD1D1',
  },
  secondaryText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryDangerText: {
    color: COLORS.error,
  },
});

export default BotoesAcaoFixo;
