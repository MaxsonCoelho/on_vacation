import { StyleProp, ViewStyle } from 'react-native';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface AlertProps {
  message: string;
  variant?: AlertVariant;
  style?: StyleProp<ViewStyle>;
}
