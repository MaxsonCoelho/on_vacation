import React, { useState, useCallback, useEffect } from 'react';
import { View, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VacationStackParamList } from '../../../../../app/navigation/collaborator/stacks/VacationStack';
import { FlashList } from '@shopify/flash-list';
import { 
  ScreenContainer, 
  Text,
  FilterList
} from '../../../../../core/design-system';
import { styles } from './styles';
import { useVacationStore } from '../../store/useVacationStore';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { theme } from '../../../../../core/design-system/tokens';
import { VacationHistoryItem } from '../../components/VacationHistoryItem/VacationHistoryItem';
import { VacationRequest } from '../../../domain/entities/VacationRequest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FlashListAny = FlashList as any;

const filters: string[] = ['Todos', 'Pendentes', 'Aprovadas', 'Reprovadas'];

type NavigationProp = NativeStackNavigationProp<VacationStackParamList, 'VacationHistory'>;

export const VacationHistoryScreen = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const navigation = useNavigation<NavigationProp>();
  const { requests, fetchRequests, isLoading, subscribeToRealtime, unsubscribeFromRealtime } = useVacationStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  // Subscribe to realtime updates
  useEffect(() => {
    if (user?.id) {
      subscribeToRealtime(user.id);
    }
    
    return () => {
      unsubscribeFromRealtime();
    };
  }, [user?.id, subscribeToRealtime, unsubscribeFromRealtime]);

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
          <FlashListAny
            data={filteredRequests}
            estimatedItemSize={100}
            keyExtractor={(item: VacationRequest) => item.id}
            contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: theme.spacing.xl }}
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
            renderItem={({ item }: { item: VacationRequest }) => (
              <VacationHistoryItem
                request={item}
                onPress={() => navigation.navigate('VacationRequestDetails', { id: item.id })}
              />
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
};
