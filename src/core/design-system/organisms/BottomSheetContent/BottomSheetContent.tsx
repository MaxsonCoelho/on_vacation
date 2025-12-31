import React from 'react';
import { View } from 'react-native';
import { ModalContent } from '../../molecules';
import { BottomSheetContentProps } from './types';
import { styles } from './styles';

export const BottomSheetContent: React.FC<BottomSheetContentProps> = ({
  showHandle = true,
  style,
  contentContainerStyle,
  ...modalProps
}) => {
  return (
    <View style={[styles.container, style]}>
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
