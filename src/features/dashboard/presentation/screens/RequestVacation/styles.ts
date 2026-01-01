import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
  },
  textAreaInput: {
    textAlignVertical: 'top',
    paddingTop: theme.spacing.sm,
    height: '100%',
  },
  helperText: {
    marginTop: theme.spacing.xs,
  },
});
