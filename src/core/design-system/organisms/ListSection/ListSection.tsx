import React from 'react';
import { View } from 'react-native';
import { Text, Spacer } from '../../atoms';
import { ListSectionProps } from './types';
import { styles } from './styles';

export const ListSection: React.FC<ListSectionProps> = ({
  title,
  description,
  children,
  rightAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="title" weight="bold">
            {title}
          </Text>
          {description && (
            <>
              <Spacer size="xs" />
              <Text variant="body" color="text.secondary">
                {description}
              </Text>
            </>
          )}
        </View>
        {rightAction && rightAction}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};
