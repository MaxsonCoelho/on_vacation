import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ManagerRequestsStackParamList } from '../../../../../app/navigation/manager/stacks/ManagerRequestsStack';
import { FlashList } from '@shopify/flash-list';
import { 
  ScreenContainer, 
  Text, 
  FilterList,
  TeamRequestListItem
} from '../../../../../core/design-system';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';
import { useManagerStore } from '../../store/useManagerStore';
import { TeamRequest } from '../../../domain/entities/TeamRequest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FlashListAny = FlashList as any;

const FILTERS = ['Todas', 'Pendentes', 'Aprovadas', 'Reprovadas'];

type NavigationProp = NativeStackNavigationProp<ManagerRequestsStackParamList, 'ManagerRequests'>;

export const ManagerRequestsScreen = () => {
  const [activeFilter, setActiveFilter] = useState('Todas');
  const navigation = useNavigation<NavigationProp>();
  const { requests, isLoading, fetchRequests, subscribeToRealtime, unsubscribeFromRealtime } = useManagerStore();

  useFocusEffect(
    useCallback(() => {
      fetchRequests(activeFilter);
      subscribeToRealtime();
      
      return () => {
        // We don't unsubscribe on blur to keep updates coming if we go to details
        // But we should consider if we want to unsubscribe when leaving the stack
      };
    }, [activeFilter, fetchRequests, subscribeToRealtime])
  );
  
  // Also use useEffect for mounting/unmounting
  React.useEffect(() => {
      return () => {
          unsubscribeFromRealtime();
      }
  }, [unsubscribeFromRealtime]);

  if (isLoading && requests.length === 0) {
      return (
         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
         </View>
      );
  }

  return (
    <ScreenContainer scrollable={false} style={{ flex: 1 }} edges={['left', 'right']}>
      <View style={styles.container}>
        <FilterList 
          filters={FILTERS}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        <View style={{ flex: 1 }}>
            {isLoading ? (
               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
               </View>
            ) : (
              <FlashListAny
                data={requests}
                estimatedItemSize={80}
                keyExtractor={(item: TeamRequest) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text variant="body" color="text.secondary">Nenhuma solicitação encontrada.</Text>
                    </View>
                }
                renderItem={({ item }: { item: TeamRequest }) => (
                  <TeamRequestListItem
                    employeeName={item.employeeName}
                    employeeAvatarUrl={item.employeeAvatarUrl}
                    startDate={item.startDate}
                    endDate={item.endDate}
                    status={item.status}
                    avatarSize="lg"
                    showStatusDot={true}
                    dateVariant="body"
                    onPress={() => navigation.navigate('RequestAnalysis', { id: item.id })}
                    style={styles.requestItem}
                  />
                )}
              />
            )}
        </View>
      </View>
    </ScreenContainer>
  );
};
