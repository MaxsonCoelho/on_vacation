import React from 'react';
import { View, Text } from 'react-native';
import { BadgeProps } from './types';
import { styles } from './styles';

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.container, styles[variant], style]}>
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
        {label}
      </Text>
    </View>
  );
};
