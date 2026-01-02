import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, Spacer } from '../../../../../core/design-system';
import { VacationHistoryItemProps } from './types';
import { styles } from './styles';

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'approved':
      return 'Aprovada';
    case 'rejected':
      return 'Reprovada';
    case 'cancelled':
      return 'Cancelada';
    case 'completed':
      return 'Aprovada';
    default:
      return status;
  }
};

export const VacationHistoryItem: React.FC<VacationHistoryItemProps> = ({
  request,
  onPress,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      <View style={styles.content}>
        <Text variant="body" weight="bold">
          {request.title}
        </Text>
        <Spacer size="xs" />
        <Text variant="body" color="primary">
          {request.startDate} - {request.endDate}
        </Text>
        <Spacer size="xs" />
        <Text variant="caption" color="text.secondary" style={{ textTransform: 'capitalize' }}>
          Status: {getStatusLabel(request.status)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

