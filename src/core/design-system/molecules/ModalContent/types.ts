import { StyleProp, ViewStyle } from 'react-native';

export interface ModalAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

export interface ModalContentProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}
