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
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style]}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
    >
      <TabIcon name={icon} active={active} />
      <Text
        variant="caption"
        color={active ? 'primary' : 'text.disabled'}
        style={styles.label}
        weight={active ? 'medium' : 'regular'}
      >
        {label}
      </Text>
    </Pressable>
  );
};
