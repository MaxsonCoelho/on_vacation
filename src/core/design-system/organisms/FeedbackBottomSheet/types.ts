import { BottomSheetContentProps } from '../BottomSheetContent/types';

export interface FeedbackBottomSheetProps extends BottomSheetContentProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  visible?: boolean;
}
