import { StyleProp, ViewStyle } from 'react-native';
import { Edge } from 'react-native-safe-area-context';

export interface SafeAreaProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}
