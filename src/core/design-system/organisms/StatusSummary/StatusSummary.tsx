import React from 'react';
import { View } from 'react-native';
import { Text, Badge } from '../../atoms';
import { Card } from '../../molecules';
import { StatusSummaryProps } from './types';
import { styles } from './styles';

export const StatusSummary: React.FC<StatusSummaryProps> = ({
  items,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {items.map((item) => (
        <Card key={item.id} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.header}>
              <Text variant="label" color="text.secondary">
                {item.label}
              </Text>
              {item.status && (
                <Badge label={item.status.toUpperCase()} variant={item.status} />
              )}
            </View>
            
            <Text variant="title" weight="bold" style={styles.value}>
              {item.value}
            </Text>

            {item.trend && (
              <Text variant="caption" color="text.secondary">
                {item.trend}
              </Text>
            )}
          </View>
        </Card>
      ))}
    </View>
  );
};
