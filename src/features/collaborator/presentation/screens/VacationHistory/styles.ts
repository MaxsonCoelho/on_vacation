import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  filterItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    marginRight: theme.spacing.sm,
  },
  filtersContainer: {
    flexGrow: 0,
    marginBottom: theme.spacing.md,
  },
  filtersContentContainer: {
    paddingHorizontal: theme.spacing.xs,
  },
});
