import { StyleProp, ViewStyle } from 'react-native';
import { IconName } from '../Icon/types';

export interface TabIconProps {
  name: IconName;
  active: boolean;
  style?: StyleProp<ViewStyle>;
  activeColor?: string;
}
