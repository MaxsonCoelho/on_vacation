import React from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button } from '../../atoms';
import { FormProps } from './types';
import { styles } from './styles';

export const Form: React.FC<FormProps> = ({
  children,
  primaryAction,
  secondaryAction,
  style,
  contentStyle,
}) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, contentStyle]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      {(primaryAction || secondaryAction) && (
        <View style={styles.actions}>
          {primaryAction && (
            <Button
              title={primaryAction.label}
              onPress={primaryAction.onPress}
              loading={primaryAction.loading}
              disabled={primaryAction.disabled}
              variant={primaryAction.variant || 'primary'}
              style={{ width: '100%' }}
            />
          )}
          {secondaryAction && (
            <Button
              title={secondaryAction.label}
              onPress={secondaryAction.onPress}
              loading={secondaryAction.loading}
              disabled={secondaryAction.disabled}
              variant={secondaryAction.variant || 'secondary'}
              style={{ width: '100%' }}
            />
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
