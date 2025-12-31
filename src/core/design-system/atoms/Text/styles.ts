import { StyleSheet, TextStyle } from 'react-native';
import { theme } from '../../tokens';
import { TextVariant, ThemeColor } from './types';

export const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.fontSize.title,
    lineHeight: theme.typography.lineHeight.title,
    fontWeight: theme.typography.weight.bold,
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.subtitle,
    lineHeight: theme.typography.lineHeight.subtitle,
    fontWeight: theme.typography.weight.medium,
  },
  body: {
    fontSize: theme.typography.fontSize.body,
    lineHeight: theme.typography.lineHeight.body,
    fontWeight: theme.typography.weight.regular,
  },
  caption: {
    fontSize: theme.typography.fontSize.caption,
    lineHeight: theme.typography.lineHeight.caption,
    fontWeight: theme.typography.weight.regular,
  },
  label: {
    fontSize: theme.typography.fontSize.label,
    lineHeight: theme.typography.lineHeight.label,
    fontWeight: theme.typography.weight.medium,
    letterSpacing: theme.typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
});


export const getTextStyle = (
  variant: TextVariant,
  weight?: keyof typeof theme.typography.weight,
  colorPath?: ThemeColor
): TextStyle => {
  const baseStyle = styles[variant];
  
  // Resolve color from theme path (e.g., 'text.primary' -> theme.colors.text.primary)
  let resolvedColor = theme.colors.text.primary;
  if (colorPath) {
    const parts = colorPath.split('.');
    if (parts.length === 2) {
      // @ts-expect-error - dynamic access to nested theme colors
      resolvedColor = theme.colors[parts[0]][parts[1]];
    } else {
      // @ts-expect-error - dynamic access to top-level theme colors
      resolvedColor = theme.colors[colorPath];
    }
  }

  return {
    ...baseStyle,
    ...(weight ? { fontWeight: theme.typography.weight[weight] } : {}),
    color: resolvedColor,
  };
};
