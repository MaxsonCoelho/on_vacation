import { StyleProp, ViewStyle } from 'react-native';
import { IconName } from '../Icon/types';

export interface HeaderIconActionProps {
  icon: IconName;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
