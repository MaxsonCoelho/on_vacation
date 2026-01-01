import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  form: {
    marginTop: theme.spacing.md,
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
  },
  textAreaInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
});
