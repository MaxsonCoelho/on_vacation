import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminUsersStackParamList } from '../../../../../app/navigation/admin/stacks/AdminUsersStack';
import { FlashList } from '@shopify/flash-list';
import { 
  ScreenContainer, 
  Text,
  FilterList
} from '../../../../../core/design-system';
import { styles } from './styles';
import { useAdminStore } from '../../store/useAdminStore';
import { theme } from '../../../../../core/design-system/tokens';
import { TeamRequest } from '../../../../manager/domain/entities/TeamRequest';
import { VacationHistoryItem } from '../../../../collaborator/presentation/components/VacationHistoryItem/VacationHistoryItem';
import { VacationRequest } from '../../../../collaborator/domain/entities/VacationRequest';

const FlashListAny = FlashList as any;

const filters: string[] = ['Todos', 'Pendentes', 'Aprovadas', 'Reprovadas'];

type NavigationProp = NativeStackNavigationProp<AdminUsersStackParamList, 'UserRequests'>;
type RouteProp = {
  params: {
    userId: string;
    userName: string;
  };
};

export const AdminUserRequestsScreen = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { userId, userName } = route.params || { userId: '', userName: '' };
  const { userRequests, fetchUserRequests, isLoading } = useAdminStore();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchUserRequests(userId);
      }
    }, [userId, fetchUserRequests])
  );

  const onRefresh = useCallback(async () => {
    if (userId) {
      setRefreshing(true);
      await fetchUserRequests(userId);
      setRefreshing(false);
    }
  }, [userId, fetchUserRequests]);

  const getFilteredRequests = () => {
    if (activeFilter === 'Todos') return userRequests;
    
    const statusMap: Record<string, string> = {
      'Pendentes': 'pending',
      'Aprovadas': 'approved',
      'Reprovadas': 'rejected'
    };

    const filtered = userRequests.filter(req => req.status === statusMap[activeFilter]);
    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  const convertToVacationRequest = (teamRequest: TeamRequest): VacationRequest => {
    return {
      id: teamRequest.id,
      userId: teamRequest.employeeId,
      title: teamRequest.title,
      startDate: teamRequest.startDate,
      endDate: teamRequest.endDate,
      status: teamRequest.status,
      collaboratorNotes: teamRequest.notes,
      createdAt: teamRequest.createdAt,
      updatedAt: teamRequest.updatedAt,
    };
  };

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

        {isLoading && !userRequests.length ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlashListAny
            data={filteredRequests}
            estimatedItemSize={100}
            keyExtractor={(item: TeamRequest) => item.id}
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
            renderItem={({ item }: { item: TeamRequest }) => (
              <VacationHistoryItem
                request={convertToVacationRequest(item)}
                onPress={() => navigation.navigate('UserRequestAnalysis', { 
                  id: item.id,
                  userId,
                  userName
                })}
              />
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

