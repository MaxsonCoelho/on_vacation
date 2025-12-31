import { StyleProp, ViewStyle } from 'react-native';

export interface FormAction {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface FormProps {
  children: React.ReactNode;
  primaryAction?: FormAction;
  secondaryAction?: FormAction;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}
