import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';
import { ButtonVariant } from './types';

export const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  text: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.weight.bold,
    textTransform: 'uppercase',
  },

});

export const getVariantStyles = (variant: ButtonVariant, disabled: boolean) => {
  const { colors } = theme;

  if (disabled) {
    return {
      container: {
        backgroundColor: colors.action.disabledBackground,
        borderWidth: 0,
      },
      text: {
        color: colors.action.disabledText,
      },
    };
  }

  switch (variant) {
    case 'secondary':
      return {
        container: {
          backgroundColor: colors.secondary,
        },
        text: {
          color: colors.text.inverse,
        },
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
        },
        text: {
          color: colors.primary,
        },
      };
    case 'primary':
    default:
      return {
        container: {
          backgroundColor: colors.primary,
        },
        text: {
          color: colors.text.inverse,
        },
      };
  }
};
