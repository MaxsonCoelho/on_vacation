import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: 100, // Circular background
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  description: {
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});
