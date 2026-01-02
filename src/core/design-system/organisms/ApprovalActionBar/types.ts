import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface ApprovalActionBarProps {
  onApprove: () => void;
  onReject: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  approveLabel?: string;
  rejectLabel?: string;
  approveButtonProps?: {
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
  };
}
