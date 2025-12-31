import { TextInputProps } from 'react-native';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}
