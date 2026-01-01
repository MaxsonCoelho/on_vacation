import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemIcon: {
    marginRight: theme.spacing.md,
    width: 24,
    alignItems: 'center',
  },
  menuItemContent: {
    flex: 1,
  },
  logoutButtonContainer: {
    marginTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
});
