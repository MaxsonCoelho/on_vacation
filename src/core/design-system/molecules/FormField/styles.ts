import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: theme.spacing.xs,
  },
  error: {
    marginTop: theme.spacing.xs,
  },
});
