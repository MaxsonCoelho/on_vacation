import { StyleProp, ViewStyle } from 'react-native';

export interface ActionRowProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  spacing?: number;
}
