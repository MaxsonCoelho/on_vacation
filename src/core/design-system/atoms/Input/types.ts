import { TextInputProps } from 'react-native';
import { IconName } from '../Icon/types';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
}
