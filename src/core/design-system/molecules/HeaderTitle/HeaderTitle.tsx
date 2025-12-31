import React from 'react';
import { View } from 'react-native';
import { Text } from '../../atoms';
import { HeaderTitleProps } from './types';
import { styles, getAlignmentStyles } from './styles';

export const HeaderTitle: React.FC<HeaderTitleProps> = ({
  title,
  subtitle,
  align = 'center',
  style,
}) => {
  const alignStyles = getAlignmentStyles(align);

  return (
    <View style={[styles.container, alignStyles, style]}>
      <Text
        variant="title"
        weight="bold"
        color="text.primary"
        numberOfLines={1}
        style={{ textAlign: align }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          variant="caption"
          color="text.secondary"
          numberOfLines={1}
          style={{ textAlign: align }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};
