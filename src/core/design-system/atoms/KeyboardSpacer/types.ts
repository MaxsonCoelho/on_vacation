import { StyleProp, ViewStyle, KeyboardAvoidingViewProps } from 'react-native';

export interface KeyboardSpacerProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  offset?: number;
  behavior?: KeyboardAvoidingViewProps['behavior'];
}
