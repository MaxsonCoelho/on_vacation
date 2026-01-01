import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ButtonProps } from './types';
import { styles, getVariantStyles } from './styles';
import { Icon } from '../Icon';
import { IconName, ThemeColor } from '../Icon/types';
import { Spacer } from '../Spacer';

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  fontSize,
  textStyle,
  style,
  leftIcon,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const variantStyles = getVariantStyles(variant, isDisabled);

  const getIconColor = (): ThemeColor => {
    if (isDisabled) return 'text.disabled';
    if (variant === 'primary' || variant === 'secondary') return 'text.inverse';
    if (variant === 'ghost') return 'primary';
    if (variant === 'outline') return 'text.primary';
    return 'text.inverse';
  };

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
        <>
          {leftIcon && (
            <>
              <Icon name={leftIcon as IconName} size={20} color={getIconColor()} />
              <Spacer size="xs" />
            </>
          )}
          <Text style={[styles.text, variantStyles.text, fontSize ? { fontSize } : undefined, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
