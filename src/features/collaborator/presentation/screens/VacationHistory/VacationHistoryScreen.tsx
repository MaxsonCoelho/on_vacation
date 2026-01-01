import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VacationStackParamList } from '../../../../../app/navigation/collaborator/stacks/VacationStack';
import { 
  ScreenContainer, 
  Text, 
  Spacer 
} from '../../../../../core/design-system';
import { styles } from './styles';
import { useVacationStore } from '../../store/useVacationStore';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { theme } from '../../../../../core/design-system/tokens';

type FilterType = 'Todos' | 'Pendentes' | 'Aprovadas' | 'Reprovadas';

const filters: FilterType[] = ['Todos', 'Pendentes', 'Aprovadas', 'Reprovadas'];

type NavigationProp = NativeStackNavigationProp<VacationStackParamList, 'VacationHistory'>;

export const VacationHistoryScreen = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');
  const navigation = useNavigation<NavigationProp>();
  const { requests, fetchRequests, isLoading } = useVacationStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchRequests(user.id);
      }
    }, [user?.id, fetchRequests])
  );

  const onRefresh = useCallback(async () => {
    if (user?.id) {
      setRefreshing(true);
      await fetchRequests(user.id);
      setRefreshing(false);
    }
  }, [user?.id, fetchRequests]);

  const getFilteredRequests = () => {
    if (activeFilter === 'Todos') return requests;
    
    const statusMap: Record<string, string> = {
      'Pendentes': 'pending',
      'Aprovadas': 'approved',
      'Reprovadas': 'rejected'
    };

    return requests.filter(req => req.status === statusMap[activeFilter]);
  };

  const filteredRequests = getFilteredRequests();

  const renderFilter = (filter: FilterType) => {
    const isActive = activeFilter === filter;
    const backgroundColor = isActive ? '#E0E0E0' : '#F0F2F5'; 
    
    return (
      <TouchableOpacity
        key={filter}
        style={[styles.filterItem, { backgroundColor }]}
        onPress={() => setActiveFilter(filter)}
      >
        <Text variant="body" weight={isActive ? 'bold' : 'regular'}>
          {filter}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer scrollable={false} style={{ flex: 1 }} edges={['left', 'right']}>
      <View style={styles.container}>
        <View>
            <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContentContainer}
            >
            {filters.map(renderFilter)}
            </ScrollView>
        </View>

        {isLoading && !requests.length ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredRequests}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={() => (
              <View style={{ padding: theme.spacing.md, alignItems: 'center' }}>
                <Text variant="body" color="text.secondary">
                  Nenhuma solicitação encontrada.
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.vacationItem}
                onPress={() => navigation.navigate('VacationRequestDetails', { id: item.id })}
              >
                <View style={styles.vacationContent}>
                  <Text variant="body" weight="bold">
                    {item.title}
                  </Text>
                  <Spacer size="xs" />
                  <Text variant="body" color="primary">
                    {item.startDate} - {item.endDate}
                  </Text>
                  <Spacer size="xs" />
                  <Text variant="caption" color="text.secondary" style={{ textTransform: 'capitalize' }}>
                    Status: {item.status === 'pending' ? 'Pendente' : item.status === 'approved' ? 'Aprovada' : 'Reprovada'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
};
