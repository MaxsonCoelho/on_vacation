import { StyleProp, ViewStyle } from 'react-native';
import { IconName } from '../../atoms/Icon/types';
import { ButtonVariant } from '../../atoms/Button/types';

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconName;
  action?: EmptyStateAction;
  style?: StyleProp<ViewStyle>;
}
