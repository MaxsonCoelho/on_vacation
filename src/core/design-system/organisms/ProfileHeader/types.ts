import { StyleProp, ViewStyle } from 'react-native';

export interface ProfileHeaderProps {
  name: string;
  role: string;
  avatarUrl?: string;
  style?: StyleProp<ViewStyle>;
}
