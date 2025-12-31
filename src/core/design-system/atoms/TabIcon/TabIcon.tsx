import React from 'react';
import { View } from 'react-native';
import { Icon } from '../Icon';
import { TabIconProps } from './types';
import { styles, ICON_SIZE } from './styles';

export const TabIcon: React.FC<TabIconProps> = ({
  name,
  active,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Icon
        name={name}
        size={ICON_SIZE}
        color={active ? 'primary' : 'text.disabled'}
      />
    </View>
  );
};
