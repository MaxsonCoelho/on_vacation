import React from 'react';
import { View, Image, Text } from 'react-native';
import { AvatarProps } from './types';
import { styles, getAvatarSize, getInitialsFontSize } from './styles';

export const Avatar: React.FC<AvatarProps> = ({
  source,
  initials,
  size = 'md',
  style,
  imageStyle,
}) => {
  const sizeStyles = getAvatarSize(size);
  const initialsFontSize = getInitialsFontSize(size);

  return (
    <View style={[styles.container, sizeStyles, style]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, imageStyle]}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, initialsFontSize]}>
          {initials ? initials.substring(0, 2).toUpperCase() : '?'}
        </Text>
      )}
    </View>
  );
};
