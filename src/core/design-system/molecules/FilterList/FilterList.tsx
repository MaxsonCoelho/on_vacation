import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Text } from '../../atoms/Text';
import { theme } from '../../tokens';

export interface FilterListProps {
  filters: string[];
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  style?: ViewStyle;
}

export const FilterList: React.FC<FilterListProps> = ({
  filters,
  activeFilter,
  onSelectFilter,
  style,
}) => {
  const renderFilter = (filter: string) => {
    const isActive = activeFilter === filter;
    const backgroundColor = isActive ? '#E0E0E0' : '#F0F2F5';
    
    return (
      <TouchableOpacity
        key={filter}
        style={[styles.filterItem, { backgroundColor }]}
        onPress={() => onSelectFilter(filter)}
      >
        <Text variant="body" weight={isActive ? 'bold' : 'regular'}>
          {filter}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={[styles.filtersContainer, style]}
      contentContainerStyle={styles.filtersContentContainer}
    >
      {filters.map(renderFilter)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexGrow: 0,
    marginBottom: theme.spacing.md,
  },
  filtersContentContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    marginRight: theme.spacing.sm,
  },
});
