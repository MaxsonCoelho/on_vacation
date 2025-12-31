import React from 'react';
import { Pressable } from 'react-native';
import { Icon } from '../Icon';
import { HeaderIconActionProps } from './types';
import { styles } from './styles';

export const HeaderIconAction: React.FC<HeaderIconActionProps> = ({
  icon,
  onPress,
  disabled = false,
  style,
  testID,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      style={({ pressed }) => [
        styles.container,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      hitSlop={8}
    >
      <Icon 
        name={icon} 
        size={24} 
        color={disabled ? 'text.disabled' : 'primary'} 
      />
    </Pressable>
  );
};
