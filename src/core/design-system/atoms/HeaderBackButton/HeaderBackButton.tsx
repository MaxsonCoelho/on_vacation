import React from 'react';
import { Pressable } from 'react-native';
import { Icon } from '../Icon';
import { HeaderBackButtonProps } from './types';
import { styles } from './styles';

export const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({
  onPress,
  style,
  testID,
}) => {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
      hitSlop={8}
    >
      <Icon name="chevron-left" size={24} color="primary" />
    </Pressable>
  );
};
