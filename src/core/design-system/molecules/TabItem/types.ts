import { StyleProp, ViewStyle } from 'react-native';
import { IconName } from '../../atoms/Icon/types';

export interface TabItemProps {
  label: string;
  icon: IconName;
  active: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}
