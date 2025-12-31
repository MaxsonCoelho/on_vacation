import React from 'react';
import { View } from 'react-native';
import { HeaderIconAction } from '../../atoms';
import { HeaderActionsProps } from './types';
import { styles } from './styles';

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  actions,
  style,
}) => {
  if (!actions || actions.length === 0) return null;

  return (
    <View style={[styles.container, style]}>
      {actions.map((action, index) => (
        <HeaderIconAction
          key={`${action.icon}-${index}`}
          {...action}
        />
      ))}
    </View>
  );
};
