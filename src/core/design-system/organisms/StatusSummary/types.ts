import { StyleProp, ViewStyle } from 'react-native';
import { BadgeVariant } from '../../atoms/Badge/types';

export interface StatusItem {
  id: string;
  label: string;
  value: string | number;
  status?: BadgeVariant;
  trend?: string; // e.g., "+10%"
}

export interface StatusSummaryProps {
  items: StatusItem[];
  columns?: number;
  style?: StyleProp<ViewStyle>;
}
