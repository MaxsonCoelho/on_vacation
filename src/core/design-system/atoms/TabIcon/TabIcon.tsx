import React from 'react';
import { View } from 'react-native';
import { Icon } from '../Icon';
import { TabIconProps } from './types';
import { styles, ICON_SIZE } from './styles';

export const TabIcon: React.FC<TabIconProps> = ({
  name,
  active,
  style,
  activeColor,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Icon
        name={name}
        size={ICON_SIZE}
        color={active && activeColor ? activeColor : (active ? 'primary' : 'text.disabled')}
      />
    </View>
  );
};
