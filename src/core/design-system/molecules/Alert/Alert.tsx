import React from 'react';
import { View } from 'react-native';
import { Text, Icon } from '../../atoms';
import { theme } from '../../tokens';
import { AlertProps, AlertVariant } from './types';
import { styles, getAlertStyles } from './styles';
import { IconName, ThemeColor } from '../../atoms/Icon/types';

const getIconName = (variant: AlertVariant): IconName => {
  switch (variant) {
    case 'success':
      return 'check-circle';
    case 'warning':
      return 'alert';
    case 'error':
      return 'alert-circle';
    case 'info':
    default:
      return 'information';
  }
};

const getIconColor = (variant: AlertVariant): ThemeColor => {
  switch (variant) {
    case 'success':
      return 'status.success';
    case 'warning':
      return 'status.warning';
    case 'error':
      return 'status.error';
    case 'info':
    default:
      return 'status.info';
  }
};

export const Alert: React.FC<AlertProps> = ({
  message,
  variant = 'info',
  style,
}) => {
  const variantStyles = getAlertStyles(variant);
  const iconName = getIconName(variant);
  const iconColor = getIconColor(variant);

  return (
    <View style={[styles.container, variantStyles, style]}>
      <Icon
        name={iconName}
        color={iconColor}
        size={theme.typography.fontSize.title}
      />
      <View style={styles.textContainer}>
        <Text variant="body" color="text.primary">
          {message}
        </Text>
      </View>
    </View>
  );
};
