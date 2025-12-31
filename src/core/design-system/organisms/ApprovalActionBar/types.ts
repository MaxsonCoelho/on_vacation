import { StyleProp, ViewStyle } from 'react-native';

export interface ApprovalActionBarProps {
  onApprove: () => void;
  onReject: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  approveLabel?: string;
  rejectLabel?: string;
}
