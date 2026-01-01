import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding removed to avoid double padding with ScreenContainer
  },
  filtersContainer: {
    maxHeight: 50,
    marginBottom: theme.spacing.lg,
  },
  filtersContentContainer: {
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  filterItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.sm,
    // Optional: Add shadow/border if needed to match prototype strictly
  },
  filterItemActive: {
    backgroundColor: theme.colors.action.hover, // Adjust color to match prototype grey selection
  },
  filterText: {
    color: theme.colors.text.primary,
  },
  listContainer: {
    flex: 1,
  },
  vacationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    backgroundColor: 'transparent', // Prototype seems to just list items, maybe transparent or white
  },
  vacationContent: {
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
