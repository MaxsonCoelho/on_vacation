import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ManagerRequestsStackParamList } from '../../../../../app/navigation/manager/stacks/ManagerRequestsStack';
import { FlashList } from '@shopify/flash-list';
import { 
  ScreenContainer, 
  Text, 
  Avatar, 
  FilterList 
} from '../../../../../core/design-system';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';
import { formatDate } from '../../../../../core/utils';
import { useManagerStore } from '../../store/useManagerStore';
import { TeamRequest } from '../../../domain/entities/TeamRequest';

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
            <FlashList<TeamRequest>
              data={requests}
              estimatedItemSize={80}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                  <View style={{ alignItems: 'center', marginTop: 50 }}>
                      <Text variant="body" color="text.secondary">Nenhuma solicitação encontrada.</Text>
                  </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.requestItem}
                  onPress={() => navigation.navigate('RequestAnalysis', { id: item.id })}
                >
                  <Avatar 
                    source={item.employeeAvatarUrl} 
                    size="lg"
                    initials={item.employeeName.split(' ').map(n => n[0]).join('')} 
                  />
                  <View style={styles.requestInfo}>
                    <Text variant="body" weight="bold" style={styles.userName}>
                      {item.employeeName}
                    </Text>
                    <Text variant="body" style={styles.dateRange}>
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </Text>
                  </View>
                  <View 
                    style={[
                      styles.statusDot, 
                      { backgroundColor: getStatusColor(item.status) }
                    ]} 
                  />
                </TouchableOpacity>
              )}
            />
        </View>
      </View>
    </ScreenContainer>
  );
};
