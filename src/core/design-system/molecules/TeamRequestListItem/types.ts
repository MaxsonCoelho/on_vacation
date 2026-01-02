import { StyleProp, ViewStyle } from 'react-native';
import { AvatarSize } from '../../atoms/Avatar/types';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface TeamRequestListItemProps {
  employeeName: string;
  employeeAvatarUrl?: string;
  startDate: string;
  endDate: string;
  status?: RequestStatus;
  avatarSize?: AvatarSize;
  showStatusDot?: boolean;
  dateVariant?: 'body' | 'caption';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

