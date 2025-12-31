import { ViewStyle, StyleProp } from 'react-native';
import { Spacing } from '../../tokens/spacing';

export type CardVariant = 'default' | 'outlined';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: Spacing;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
