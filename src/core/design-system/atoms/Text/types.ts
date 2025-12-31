import { TextProps as NativeTextProps } from 'react-native';
import { theme } from '../../tokens';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'title' | 'subtitle' | 'body' | 'caption' | 'label';

// Helper type to get all nested color keys (e.g., 'primary' | 'text.primary' | 'status.error')
type ColorKeys<T> = {
  [K in keyof T]: T[K] extends object
    ? `${string & K}.${string & keyof T[K]}`
    : K;
}[keyof T];

export type ThemeColor = ColorKeys<typeof theme.colors>;

export interface TextProps extends NativeTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  weight?: keyof typeof theme.typography.weight;
  color?: ThemeColor;
}
