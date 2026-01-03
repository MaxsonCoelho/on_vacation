import { StyleProp, ViewStyle } from 'react-native';
import { IconName } from '../../atoms/Icon/types';

export interface TabConfig {
  key: string;
  label: string;
  icon: IconName;
}

export interface BottomTabBarProps {
  tabs: TabConfig[];
  activeKey: string;
  onTabPress: (key: string) => void;
  style?: StyleProp<ViewStyle>;
  activeColor?: string;
}
