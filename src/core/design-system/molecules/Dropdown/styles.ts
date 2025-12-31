import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1, // Ensure dropdown sits on top
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  triggerDisabled: {
    backgroundColor: theme.colors.action.disabledBackground,
    borderColor: theme.colors.action.disabledBackground,
  },
  menu: {
    position: 'absolute',
    top: 52, // 48 (height) + 4 (spacing)
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
    maxHeight: 200,
  },
  option: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    backgroundColor: theme.colors.primary + '1A', // 10% opacity
  },
  optionText: {
    flex: 1,
  },
});
