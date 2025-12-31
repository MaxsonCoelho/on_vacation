import { StyleProp, ViewStyle } from 'react-native';
import { ModalContentProps } from '../../molecules/ModalContent/types';

export interface BottomSheetContentProps extends ModalContentProps {
  showHandle?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}
