import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalContent } from '../../molecules';
import { BottomSheetContentProps } from './types';
import { styles } from './styles';

export const BottomSheetContent: React.FC<BottomSheetContentProps> = ({
  showHandle = true,
  style,
  contentContainerStyle,
  ...modalProps
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container, 
      { paddingBottom: Math.max(insets.bottom + 16, 32) },
      style
    ]}>
      {showHandle && (
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
      )}
      
      <ModalContent
        {...modalProps}
        style={[styles.modalContentOverride, contentContainerStyle]}
      />
    </View>
  );
};
