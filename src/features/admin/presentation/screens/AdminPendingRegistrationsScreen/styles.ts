import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
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
  userRole: {
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

