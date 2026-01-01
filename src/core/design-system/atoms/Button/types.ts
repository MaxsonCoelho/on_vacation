import { TouchableOpacityProps, StyleProp, TextStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  fontSize?: number;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: string;
}
