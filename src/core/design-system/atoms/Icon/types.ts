import { theme } from '../../tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type ColorKeys<T> = {
  [K in keyof T]: T[K] extends object
    ? `${string & K}.${string & keyof T[K]}`
    : K;
}[keyof T];

export type ThemeColor = ColorKeys<typeof theme.colors>;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: ThemeColor;
}
