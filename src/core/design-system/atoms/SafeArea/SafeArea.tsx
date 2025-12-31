import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProps } from './types';
import { styles } from './styles';

export const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  edges,
  style,
}) => {
  return (
    <SafeAreaView edges={edges} style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
};
