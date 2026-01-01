import { StyleProp, ViewStyle } from 'react-native';
import { InputProps } from '../../atoms/Input/types';

export interface FormFieldProps extends InputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
}
