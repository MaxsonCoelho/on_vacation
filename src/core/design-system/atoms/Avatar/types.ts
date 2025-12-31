import { StyleProp, ViewStyle, ImageStyle } from 'react-native';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  source?: string;
  initials?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}
