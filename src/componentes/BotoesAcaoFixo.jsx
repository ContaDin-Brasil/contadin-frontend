import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { getColorsByTheme } from '../styles/colors';
import { useTheme } from '../contexts/ThemeContext';

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
  const { isDarkMode } = useTheme();
  const COLORS = getColorsByTheme(isDarkMode);

  const hasSecondary = Boolean(secondaryLabel);
  const primaryText = primaryLoading && primaryLoadingLabel ? primaryLoadingLabel : primaryLabel;
  const secondaryText = secondaryLoading && secondaryLoadingLabel ? secondaryLoadingLabel : secondaryLabel;

  return (
    <View style={[styles.footer, { backgroundColor: COLORS.background }]}>
      <View style={hasSecondary ? styles.row : styles.singleRow}>
        {hasSecondary && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              { backgroundColor: COLORS.backgroundLight, borderColor: COLORS.border },
              secondaryVariant === 'danger' && {
                backgroundColor: isDarkMode ? COLORS.backgroundLight : COLORS.background,
                borderColor: isDarkMode ? COLORS.error + '55' : COLORS.error + '33',
              },
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
                { color: COLORS.textPrimary },
                secondaryVariant === 'danger' && { color: COLORS.error },
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
            { backgroundColor: COLORS.primary },
            (primaryDisabled || primaryLoading) && styles.buttonDisabled,
            hasSecondary ? styles.buttonHalf : styles.buttonFull,
          ]}
          onPress={onPrimaryPress}
          disabled={primaryDisabled || primaryLoading}
        >
          {primaryLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : null}
          <Text style={[styles.primaryText, { color: COLORS.white }]}>{primaryText}</Text>
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
    borderRadius: 14,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default BotoesAcaoFixo;
