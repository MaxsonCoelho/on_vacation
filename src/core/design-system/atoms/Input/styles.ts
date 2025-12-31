import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    height: 48,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.text.primary,
    height: '100%',
  },
  errorText: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.status.error,
  },

});

export const getInputStyles = (
  focused: boolean,
  error: boolean,
  disabled: boolean
) => {
  const { colors } = theme;

  let borderColor = colors.border;
  let backgroundColor = colors.background;
  let textColor = colors.text.primary;

  if (disabled) {
    borderColor = colors.action.disabledBackground;
    backgroundColor = colors.action.disabledBackground;
    textColor = colors.action.disabledText;
  } else if (error) {
    borderColor = colors.status.error;
  } else if (focused) {
    borderColor = colors.primary;
  }

  return {
    container: {
      borderColor,
      backgroundColor,
    },
    input: {
      color: textColor,
    },
  };
};
