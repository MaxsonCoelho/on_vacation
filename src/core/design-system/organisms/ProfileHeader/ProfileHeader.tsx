import React from 'react';
import { View } from 'react-native';
import { Avatar, Text, Spacer } from '../../atoms';
import { Card } from '../../molecules';
import { ProfileHeaderProps } from './types';
import { styles } from './styles';

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  role,
  avatarUrl,
  style,
}) => {
  return (
    <Card style={[styles.container, style]} variant="default" padding="md">
      <Avatar source={avatarUrl} initials={name} size="md" />
      <Spacer size="md" horizontal />
      <View style={styles.info}>
        <Text variant="title" weight="bold">
          {name}
        </Text>
        <Text variant="body" color="text.secondary">
          {role}
        </Text>
      </View>
    </Card>
  );
};
