import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type StatusPillVariant = 'success' | 'warning' | 'error' | 'info';

export interface StatusPillProps {
  label: string;
  variant: StatusPillVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}
