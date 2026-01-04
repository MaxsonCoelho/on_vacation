import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    ...theme.shadows.lg,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  content: {
    marginBottom: theme.spacing.lg,
  },
  actions: {
    flexDirection: 'column',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
});
