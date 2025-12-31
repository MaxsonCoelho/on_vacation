import React from 'react';
import { View, Pressable } from 'react-native';
import { theme } from '../../tokens';
import { CardProps } from './types';
import { styles, getCardStyles } from './styles';

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
  onPress,
}) => {
  const Container = onPress ? Pressable : View;
  const variantStyles = getCardStyles(variant);
  const paddingValue = theme.spacing[padding];

  return (
    <Container
      onPress={onPress}
      style={[
        styles.base,
        variantStyles,
        { padding: paddingValue },
        style,
      ]}
    >
      {children}
    </Container>
  );
};
