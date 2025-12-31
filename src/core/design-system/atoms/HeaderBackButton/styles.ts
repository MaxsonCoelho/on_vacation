import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';

export const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: theme.colors.border,
    opacity: 0.7,
  },
});
