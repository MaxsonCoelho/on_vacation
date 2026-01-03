import React, { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator, RefreshControl } from 'react-native';
import { 
  ScreenContainer, 
  Text, 
  Button, 
  Card, 
  Icon, 
  Spacer,
  ProfileTag
} from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { useVacationStore } from '../../store/useVacationStore';
import { useProfileStore } from '../../store/useProfileStore';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../../../app/navigation/collaborator/stacks/HomeStack';
import { VacationRequest } from '../../../domain/entities/VacationRequest';

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const CollaboratorHomeScreen = () => {
  const { user } = useAuthStore();
  const { requests, isLoading, fetchRequests, subscribeToRealtime, unsubscribeFromRealtime } = useVacationStore();
  const { profile, fetchProfile } = useProfileStore();
  const navigation = useNavigation<HomeNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
      if (user?.id) {
          subscribeToRealtime(user.id);
      }
      return () => unsubscribeFromRealtime();
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchRequests(user.id);
        fetchProfile(user.id);
      }
    }, [user?.id, fetchRequests, fetchProfile])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (user?.id) {
        await Promise.all([
          fetchRequests(user.id),
          fetchProfile(user.id)
        ]);
      }
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, fetchRequests, fetchProfile]);

  const getFirstName = (fullName?: string) => {
    return fullName?.split(' ')[0] || 'Colaborador';
  };
  
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r: VacationRequest) => r.status === 'pending').length;
  const recentRequests = requests.slice(0, 3);

  if (isLoading && requests.length === 0) {
    return (
      <ScreenContainer edges={['left', 'right']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer 
      scrollable 
      edges={['left', 'right']}
      scrollViewProps={{
        refreshControl: (
          <RefreshControl 
            refreshing={refreshing || (isLoading && requests.length > 0)} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        )
      }}
    >
      <View style={styles.container}>
        {user?.role && <ProfileTag role={user.role} />}
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text variant="h1" weight="bold">
            Olá, {getFirstName(profile?.name || user?.name)}
          </Text>
        </View>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <Text variant="h3" weight="bold" color="text.primary">
              Solicitações de Férias
            </Text>
            <Spacer size="xs" />
            <Text variant="body" color="primary">
              Total: {totalRequests} | Pendentes: {pendingRequests}
            </Text>
          </View>
          <View style={styles.summaryIconContainer}>
            <Icon name="calendar-check" size={32} color="secondary" />
          </View>
        </Card>

        {/* Action Button */}
        <View style={styles.actionButton}>
          <Button 
            title="Solicitar férias" 
            variant="primary" 
            onPress={() => navigation.navigate('RequestVacation')} 
          />
        </View>

        {/* Recent Requests */}
        <View>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Solicitações recentes
          </Text>
          
          {recentRequests.length > 0 ? (
            recentRequests.map((item: VacationRequest) => (
              <Card key={item.id} style={styles.requestItem} padding="sm">
                <View style={styles.requestIconContainer}>
                  <Icon name="calendar-blank" size={24} color="text.secondary" />
                </View>
                <View style={styles.requestContent}>
                  <Text variant="body" weight="bold">{item.title}</Text>
                  <Text variant="caption" color="text.secondary">
                    {item.startDate} - {item.endDate}
                  </Text>
                </View>
                <View 
                  style={[
                    styles.statusDot, 
                    { backgroundColor: item.status === 'approved' || item.status === 'completed' 
                        ? theme.colors.status.success 
                        : item.status === 'rejected' || item.status === 'cancelled'
                        ? theme.colors.status.error
                        : theme.colors.status.warning 
                    }
                  ]} 
                />
              </Card>
            ))
          ) : (
            <Text variant="body" color="text.secondary" style={{ marginTop: 10 }}>
              Nenhuma solicitação recente.
            </Text>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};

