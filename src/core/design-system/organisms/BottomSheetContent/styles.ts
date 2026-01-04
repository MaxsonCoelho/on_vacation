import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    width: '100%',
    maxHeight: '90%',
    ...theme.shadows.lg,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },
  modalContentOverride: {
    backgroundColor: 'transparent', // Remove background from inner ModalContent
    shadowColor: 'transparent', // Remove shadow from inner ModalContent
    shadowOpacity: 0,
    elevation: 0,
    padding: 0, // Reset padding as we might handle it in container
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
});
