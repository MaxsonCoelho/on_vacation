import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  logoutContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});
