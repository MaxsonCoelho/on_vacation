import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: theme.typography.fontSize.caption,
    fontWeight: theme.typography.weight.medium,
  },
  // Variants
  success: {
    backgroundColor: theme.colors.status.success + '20', // 20% opacity
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
  neutral: {
    backgroundColor: theme.colors.text.disabled + '20',
  },
  neutralText: {
    color: theme.colors.text.secondary,
  },
});
