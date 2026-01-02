import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Text, Icon } from '../../atoms';
import { ToastProps } from './types';
import { styles, getToastColors } from './styles';

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  variant = 'info',
  duration = 1500,
  onDismiss,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished && onDismiss) {
          onDismiss();
        }
      });
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, duration, fadeAnim, onDismiss]);

  if (!visible) return null;

  const colors = getToastColors(variant);
  const iconName = variant === 'success' ? 'check-circle' : variant === 'error' ? 'alert-circle' : 'information';

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: colors.background,
            opacity: fadeAnim,
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Icon name={iconName} size={24} color={colors.icon} />
        <Text variant="body" weight="medium" style={[styles.text, { color: colors.text }]}>
          {message}
        </Text>
      </Animated.View>
    </View>
  );
};
