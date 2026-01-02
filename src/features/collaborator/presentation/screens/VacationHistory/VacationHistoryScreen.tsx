import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VacationStackParamList } from '../../../../../app/navigation/collaborator/stacks/VacationStack';
import { 
  ScreenContainer, 
  Text, 
  Spacer,
  FilterList
} from '../../../../../core/design-system';
import { styles } from './styles';
import { useVacationStore } from '../../store/useVacationStore';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { theme } from '../../../../../core/design-system/tokens';

const filters: string[] = ['Todos', 'Pendentes', 'Aprovadas', 'Reprovadas'];

type NavigationProp = NativeStackNavigationProp<VacationStackParamList, 'VacationHistory'>;

export const VacationHistoryScreen = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const navigation = useNavigation<NavigationProp>();
  const { requests, fetchRequests, isLoading } = useVacationStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log('[VacationHistory] Focus effect triggered');
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
    console.log('[VacationHistory] Filtering requests. Total:', requests.length, 'Filter:', activeFilter);
    if (activeFilter === 'Todos') return requests;
    
    const statusMap: Record<string, string> = {
      'Pendentes': 'pending',
      'Aprovadas': 'approved',
      'Reprovadas': 'rejected'
    };

    const filtered = requests.filter(req => req.status === statusMap[activeFilter]);
    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  return (
    <ScreenContainer scrollable={false} style={{ flex: 1 }} edges={['left', 'right']}>
      <View style={styles.container}>
        <View>
          <FilterList 
            filters={filters}
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
          />
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
