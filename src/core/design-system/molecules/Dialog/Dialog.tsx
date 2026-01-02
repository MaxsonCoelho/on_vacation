import React from 'react';
import { Modal, View, TouchableWithoutFeedback } from 'react-native';
import { Text, Button } from '../../atoms';
import { DialogProps } from './types';
import { styles } from './styles';

export const Dialog: React.FC<DialogProps> = ({
  visible,
  title,
  message,
  actions = [],
  onClose,
  animationType = 'fade',
  transparent = true,
  ...props
}) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
      {...props}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.content}>
                <Text variant="h3" weight="bold" style={styles.title}>
                  {title}
                </Text>
                <Text variant="body" color="text.secondary" style={styles.message}>
                  {message}
                </Text>
              </View>

              <View style={[styles.actions, actions.length === 1 && styles.singleAction]}>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    title={action.text}
                    onPress={action.onPress}
                    variant={action.variant || 'primary'}
                    style={[styles.actionButton, action.style]}
                  />
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
