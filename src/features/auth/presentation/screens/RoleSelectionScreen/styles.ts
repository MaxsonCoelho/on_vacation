import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: theme.spacing.sm,
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
  },
  roleSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  roleButton: {
    flex: 1,
    // Adjust button styles if needed
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  roleList: {
    gap: theme.spacing.lg,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
  },
  roleLabel: {
    // minWidth: 100, // Optional, depending on layout preference
  },
  roleDescription: {
    flex: 1,
  },
  footer: {
    padding: theme.spacing.lg,
  },
});
