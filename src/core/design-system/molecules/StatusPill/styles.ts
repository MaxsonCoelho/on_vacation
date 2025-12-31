import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2, // Very compact
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Variants
  success: {
    backgroundColor: theme.colors.status.success + '20',
  },
  successText: {
    color: theme.colors.status.success,
  },
  warning: {
    backgroundColor: theme.colors.status.warning + '20',
  },
  warningText: {
    color: theme.colors.status.warning,
  },
  error: {
    backgroundColor: theme.colors.status.error + '20',
  },
  errorText: {
    color: theme.colors.status.error,
  },
  info: {
    backgroundColor: theme.colors.status.info + '20',
  },
  infoText: {
    color: theme.colors.status.info,
  },
});
