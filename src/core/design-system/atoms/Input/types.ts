import { TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { IconName } from '../Icon/types';

export interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  inputContainerStyle?: StyleProp<ViewStyle>;
}
