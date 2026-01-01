import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeArea } from '../../atoms';
import { ScreenContainerProps } from './types';
import { styles } from './styles';

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  scrollViewProps,
  edges,
}) => {
  const Content = (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );

  return (
    <SafeArea style={styles.container} edges={edges}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          {...scrollViewProps}
        >
          {Content}
        </ScrollView>
      ) : (
        <View style={[styles.container, contentContainerStyle]}>
          {Content}
        </View>
      )}
    </SafeArea>
  );
};
