import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../tokens';
import { IconProps } from './types';

export const Icon: React.FC<IconProps> = ({
  name,
  size = theme.typography.fontSize.subtitle,
  color = 'text.primary',
}) => {

  let resolvedColor = theme.colors.text.primary;
  
  if (color) {
    // Se for uma cor hexadecimal (começa com #), usa diretamente
    if (color.startsWith('#')) {
      resolvedColor = color;
    } else {
      const parts = color.split('.');
      if (parts.length === 2) {
        // @ts-expect-error - dynamic access to nested theme colors
        resolvedColor = theme.colors[parts[0]][parts[1]];
      } else {
        // @ts-expect-error - dynamic access to top-level theme colors
        resolvedColor = theme.colors[color];
      }
    }
  }

  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={resolvedColor}
    />
  );
};
