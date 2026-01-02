import { VacationRequest } from '../../../domain/entities/VacationRequest';
import { StyleProp, ViewStyle } from 'react-native';

export interface VacationHistoryItemProps {
  request: VacationRequest;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

