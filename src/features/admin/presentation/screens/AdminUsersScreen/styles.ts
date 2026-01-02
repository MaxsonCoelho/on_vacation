import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    paddingRight: theme.spacing.md,
    height: 48,
  },
  searchIconContainer: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
    paddingVertical: 0,
  },
  filters: {
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  userName: {
    marginBottom: theme.spacing.xs / 2,
  },
  userEmail: {
    marginBottom: 0,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.status.success,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.default,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingVertical: theme.spacing.xl,
  },
});

