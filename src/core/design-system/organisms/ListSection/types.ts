import { StyleProp, ViewStyle } from 'react-native';

export interface ListSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
