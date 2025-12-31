import React from 'react';
import { View } from 'react-native';
import { theme } from '../../tokens';
import { ActionRowProps } from './types';
import { styles } from './styles';

export const ActionRow: React.FC<ActionRowProps> = ({
  children,
  style,
  spacing = theme.spacing.sm,
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <View style={[styles.container, { gap: spacing }, style]}>
      {childrenArray.map((child, index) => (
        <View key={index} style={styles.item}>
          {child}
        </View>
      ))}
    </View>
  );
};
