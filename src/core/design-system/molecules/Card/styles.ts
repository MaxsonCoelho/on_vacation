import { StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../tokens';
import { CardVariant } from './types';

export const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
});

export const getCardStyles = (variant: CardVariant): ViewStyle => {
  const { colors, shadows } = theme;

  switch (variant) {
    case 'outlined':
      return {
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.none,
      };
    case 'default':
    default:
      return {
        borderWidth: 0,
        ...shadows.md,
      };
  }
};
