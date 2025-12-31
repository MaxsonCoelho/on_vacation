import React from 'react';
import { View } from 'react-native';
import { Text, Button, Spacer } from '../../atoms';
import { ModalContentProps } from './types';
import { styles } from './styles';

export const ModalContent: React.FC<ModalContentProps> = ({
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text variant="title" style={{ textAlign: 'center' }}>
          {title}
        </Text>
        {description && (
          <>
            <Spacer size="sm" />
            <Text variant="body" color="text.secondary" style={{ textAlign: 'center' }}>
              {description}
            </Text>
          </>
        )}
      </View>

      <View style={styles.content}>{children}</View>

      <View style={styles.actions}>
        {primaryAction && (
          <Button
            title={primaryAction.label}
            onPress={primaryAction.onPress}
            variant={primaryAction.variant || 'primary'}
            disabled={primaryAction.disabled}
            style={{ width: '100%' }}
          />
        )}
        {secondaryAction && (
          <Button
            title={secondaryAction.label}
            onPress={secondaryAction.onPress}
            variant={secondaryAction.variant || 'secondary'}
            disabled={secondaryAction.disabled}
            style={{ width: '100%' }}
          />
        )}
      </View>
    </View>
  );
};
