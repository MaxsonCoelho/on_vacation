import React from 'react';
import { Text as NativeText } from 'react-native';
import { TextProps } from './types';
import { getTextStyle } from './styles';

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  weight,
  color = 'text.primary',
  style,
  ...props
}) => {
  const textStyle = getTextStyle(variant, weight, color);

  return (
    <NativeText style={[textStyle, style]} {...props}>
      {children}
    </NativeText>
  );
};
