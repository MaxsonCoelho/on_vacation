import React from 'react';
import { View } from 'react-native';
import { Text, Icon, Button } from '../../atoms';
import { EmptyStateProps } from './types';
import { styles } from './styles';

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <View style={styles.iconContainer}>
          <Icon
            name={icon}
            size={48}
            color="primary"
          />
        </View>
      )}

      <View style={styles.textContainer}>
        <Text variant="title" style={{ textAlign: 'center' }}>
          {title}
        </Text>
        {description && (
          <Text
            variant="body"
            color="text.secondary"
            style={styles.description}
          >
            {description}
          </Text>
        )}
      </View>

      {action && (
        <Button
          title={action.label}
          onPress={action.onPress}
          variant={action.variant || 'primary'}
        />
      )}
    </View>
  );
};
