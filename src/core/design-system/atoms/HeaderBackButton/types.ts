import { StyleProp, ViewStyle } from 'react-native';

export interface HeaderBackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
