import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ButtonProps } from './types';
import { styles, getVariantStyles } from './styles';

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  fontSize,
  textStyle,
  style,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const variantStyles = getVariantStyles(variant, isDisabled);

  return (
    <TouchableOpacity
      style={[styles.container, variantStyles.container, style]}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} />
      ) : (
        <Text style={[styles.text, variantStyles.text, fontSize ? { fontSize } : undefined, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
