import React from 'react';
import { Pressable } from 'react-native';
import { TabIcon, Text } from '../../atoms';
import { TabItemProps } from './types';
import { styles } from './styles';

export const TabItem: React.FC<TabItemProps> = ({
  label,
  icon,
  active,
  onPress,
  style,
  activeColor,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style]}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
    >
      <TabIcon name={icon} active={active} activeColor={activeColor} />
      <Text
        variant="caption"
        color={active ? 'primary' : 'text.disabled'}
        style={[
          styles.label,
          active && activeColor ? { color: activeColor } : undefined,
        ]}
        weight={active ? 'medium' : 'regular'}
      >
        {label}
      </Text>
    </Pressable>
  );
};
