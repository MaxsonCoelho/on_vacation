import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Avatar } from '../../atoms/Avatar';
import { Text } from '../../atoms/Text';
import { TeamRequestListItemProps } from './types';
import { styles } from './styles';
import { theme } from '../../tokens';
import { formatDate } from '../../../utils';

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'approved':
      return theme.colors.status.success;
    case 'rejected':
      return theme.colors.status.error;
    case 'pending':
      return theme.colors.status.warning;
    default:
      return theme.colors.text.disabled;
  }
};

export const TeamRequestListItem: React.FC<TeamRequestListItemProps> = ({
  employeeName,
  employeeAvatarUrl,
  startDate,
  endDate,
  status,
  avatarSize = 'md',
  showStatusDot = false,
  dateVariant = 'caption',
  onPress,
  style,
  testID,
}) => {
  const initials = employeeName.split(' ').map(n => n[0]).join('').substring(0, 2);
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const content = (
    <>
      <Avatar 
        source={employeeAvatarUrl} 
        size={avatarSize}
        initials={initials} 
      />
      <View style={styles.requestInfo}>
        <Text variant="body" weight="regular" style={styles.userName}>
          {employeeName}
        </Text>
        <Text variant={dateVariant} style={styles.dateRange}>
          {formattedStartDate} - {formattedEndDate}
        </Text>
      </View>
      {showStatusDot && status && (
        <View 
          style={[
            styles.statusDot, 
            { backgroundColor: getStatusColor(status) }
          ]} 
        />
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        style={[styles.container, style]}
        onPress={onPress}
        activeOpacity={0.7}
        testID={testID}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      {content}
    </View>
  );
};

