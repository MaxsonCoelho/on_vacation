import React from 'react';
import { View } from 'react-native';
import { Text } from '../../atoms';
import { StatusPillProps } from './types';
import { styles } from './styles';

export const StatusPill: React.FC<StatusPillProps> = ({
  label,
  variant,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.container, styles[variant], style]}>
      <Text
        variant="caption"
        weight="medium"
        style={[styles[`${variant}Text`], textStyle]}
      >
        {label}
      </Text>
    </View>
  );
};
