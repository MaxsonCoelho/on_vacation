import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { 
  ScreenContainer, 
  Text, 
  Avatar, 
  FilterList 
} from '../../../../../core/design-system';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';

const FILTERS = ['Todas', 'Pendentes', 'Aprovadas', 'Reprovadas'];

const REQUESTS = [
  {
    id: '1',
    name: 'Carlos Pereira',
    dateRange: '15/07/2024 - 29/07/2024',
    avatarUrl: 'https://i.pravatar.cc/150?u=carlos',
    status: 'approved',
  },
  {
    id: '2',
    name: 'Ana Souza',
    dateRange: '22/07/2024 - 05/08/2024',
    avatarUrl: 'https://i.pravatar.cc/150?u=ana',
    status: 'approved',
  },
  {
    id: '3',
    name: 'Ricardo Almeida',
    dateRange: '29/07/2024 - 12/08/2024',
    avatarUrl: 'https://i.pravatar.cc/150?u=ricardo',
    status: 'approved',
  },
];

export const ManagerRequestsScreen = () => {
  const [activeFilter, setActiveFilter] = useState('Todas');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return theme.colors.status.success;
      case 'rejected':
        return theme.colors.status.error;
      case 'pending':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.disabled;
    }
  };

  return (
    <ScreenContainer scrollable={false} style={{ flex: 1 }} edges={['left', 'right']}>
      <View style={styles.container}>
        <FilterList 
          filters={FILTERS}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        <FlatList
          data={REQUESTS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <Avatar 
                source={item.avatarUrl} 
                size="lg"
                initials={item.name.split(' ').map(n => n[0]).join('')} 
              />
              <View style={styles.requestInfo}>
                <Text variant="body" weight="bold" style={styles.userName}>
                  {item.name}
                </Text>
                <Text variant="body" style={styles.dateRange}>
                  {item.dateRange}
                </Text>
              </View>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: getStatusColor(item.status) }
                ]} 
              />
            </View>
          )}
        />
      </View>
    </ScreenContainer>
  );
};
