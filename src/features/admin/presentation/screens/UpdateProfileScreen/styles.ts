import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  description: {
    marginBottom: theme.spacing.xl,
  },
  form: {
    gap: theme.spacing.md,
  },
  fieldContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  sectionDescription: {
    marginBottom: theme.spacing.md,
  },
});

