import { ModalProps } from 'react-native';

export interface DialogAction {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  style?: any;
}

export interface DialogProps extends ModalProps {
  visible: boolean;
  title: string;
  message: string;
  actions?: DialogAction[];
  onClose?: () => void;
}
