import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';
import { ToastVariant } from './types';
import { ThemeColor } from '../../atoms/Icon/types';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    transform: [{ translateY: -50 }], // Center vertically
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.full,
    ...theme.shadows.md,
    maxWidth: '100%',
  },
  text: {
    marginLeft: theme.spacing.sm,
    flex: 1,
    textAlign: 'center',
  },
});

export const getToastColors = (variant: ToastVariant): { background: string; text: string; icon: ThemeColor } => {
  switch (variant) {
    case 'success':
      return {
        background: theme.colors.status.success,
        text: theme.colors.text.inverse,
        icon: 'text.inverse',
      };
    case 'error':
      return {
        background: theme.colors.status.error,
        text: theme.colors.text.inverse,
        icon: 'text.inverse',
      };
    case 'info':
    default:
      return {
        background: theme.colors.surface,
        text: theme.colors.text.primary,
        icon: 'primary',
      };
  }
};
