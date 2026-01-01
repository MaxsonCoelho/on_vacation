import React, { useEffect } from 'react';
import { View, Modal, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS,
  SlideInDown,
  SlideOutDown,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { BottomSheetContent } from '../BottomSheetContent';
import { FeedbackBottomSheetProps } from './types';
import { styles } from './styles';
import { theme } from '../../tokens';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const getIconName = (type: FeedbackBottomSheetProps['type']) => {
  switch (type) {
    case 'success':
      return 'checkmark-circle';
    case 'error':
      return 'alert-circle';
    case 'warning':
      return 'warning';
    case 'info':
    default:
      return 'information-circle';
  }
};

const getIconColor = (type: FeedbackBottomSheetProps['type']) => {
  switch (type) {
    case 'success':
      return theme.colors.status.success;
    case 'error':
      return theme.colors.status.error;
    case 'warning':
      return theme.colors.status.warning;
    case 'info':
    default:
      return theme.colors.status.info;
  }
};

export const FeedbackBottomSheet: React.FC<FeedbackBottomSheetProps> = ({
  type = 'info',
  visible = false,
  onClose,
  children,
  ...props
}) => {
  const iconName = getIconName(type);
  const iconColor = getIconColor(type);
  
  const translateY = useSharedValue(0);
  const context = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = 0;
    }
  }, [visible]);

  const pan = Gesture.Pan()
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY + context.value;
      }
    })
    .onEnd(() => {
      if (translateY.value > SCREEN_HEIGHT * 0.2) {
        if (onClose) {
          runOnJS(onClose)();
        }
      } else {
        translateY.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none" // We handle animation with Reanimated
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View 
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.overlay}
        >
          {/* Backdrop tap to close */}
          <View 
            style={StyleSheet.absoluteFill} 
            onTouchEnd={onClose} 
          />
          
          <GestureDetector gesture={pan}>
            <Animated.View 
              entering={SlideInDown.springify().damping(30).mass(0.8).stiffness(250)}
              exiting={SlideOutDown}
              style={[styles.contentContainer, rStyle]}
            >
               <BottomSheetContent onClose={onClose} {...props}>
                <View style={styles.iconContainer}>
                  <Ionicons name={iconName} size={48} color={iconColor} />
                </View>
                {children}
              </BottomSheetContent>
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};
