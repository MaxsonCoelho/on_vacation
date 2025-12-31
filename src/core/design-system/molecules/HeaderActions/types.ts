import { StyleProp, ViewStyle } from 'react-native';
import { HeaderIconActionProps } from '../../atoms/HeaderIconAction/types';

export interface HeaderActionsProps {
  actions: HeaderIconActionProps[];
  style?: StyleProp<ViewStyle>;
}
