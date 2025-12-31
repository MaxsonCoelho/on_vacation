import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { KeyboardSpacerProps } from './types';
import { styles } from './styles';

export const KeyboardSpacer: React.FC<KeyboardSpacerProps> = ({
  children,
  style,
  offset = 0,
  behavior,
}) => {
  const defaultBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={behavior || defaultBehavior}
      keyboardVerticalOffset={offset}
    >
      {children}
    </KeyboardAvoidingView>
  );
};
