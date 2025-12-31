import { StyleProp, ViewStyle } from 'react-native';

export type HeaderTitleAlign = 'center' | 'left';

export interface HeaderTitleProps {
  title: string;
  subtitle?: string;
  align?: HeaderTitleAlign;
  style?: StyleProp<ViewStyle>;
}
