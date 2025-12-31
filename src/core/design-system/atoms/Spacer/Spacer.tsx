import React from 'react';
import { View } from 'react-native';
import { theme } from '../../tokens';
import { SpacerProps } from './types';

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  horizontal = false,
}) => {
  const value = theme.spacing[size];

  return (
    <View
      style={{
        width: horizontal ? value : 'auto',
        height: !horizontal ? value : 'auto',
      }}
    />
  );
};
