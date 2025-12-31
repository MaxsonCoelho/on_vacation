import { StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../tokens';
import { AlertVariant } from './types';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    ...theme.shadows.sm,
  },
  textContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
});

export const getAlertStyles = (variant: AlertVariant): ViewStyle => {
  const { colors } = theme;

  switch (variant) {
    case 'success':
      return {
        backgroundColor: colors.status.success + '1A', // 10% opacity
        borderLeftWidth: 4,
        borderLeftColor: colors.status.success,
      };
    case 'warning':
      return {
        backgroundColor: colors.status.warning + '1A',
        borderLeftWidth: 4,
        borderLeftColor: colors.status.warning,
      };
    case 'error':
      return {
        backgroundColor: colors.status.error + '1A',
        borderLeftWidth: 4,
        borderLeftColor: colors.status.error,
      };
    case 'info':
    default:
      return {
        backgroundColor: colors.status.info + '1A',
        borderLeftWidth: 4,
        borderLeftColor: colors.status.info,
      };
  }
};
