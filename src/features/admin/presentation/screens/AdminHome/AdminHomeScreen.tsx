import React, { useCallback, useEffect } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  ScreenContainer, 
  Text, 
  Card, 
  Spacer,
  ProfileTag
} from '../../../../../core/design-system';
import { useAdminStore } from '../../store/useAdminStore';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';
import { AdminHomeStackParamList } from '../../../../../app/navigation/admin/stacks/AdminHomeStack';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';

type NavigationProp = NativeStackNavigationProp<AdminHomeStackParamList>;

export const AdminHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { 
    reports, 
    isLoading, 
    fetchReports,
    subscribeToRealtime,
    unsubscribeFromRealtime
  } = useAdminStore();

  useEffect(() => {
    return () => unsubscribeFromRealtime();
  }, [unsubscribeFromRealtime]);

  useFocusEffect(
    useCallback(() => {
      // Sempre sincroniza quando focar na tela (se online)
      fetchReports();
      subscribeToRealtime();
    }, [fetchReports, subscribeToRealtime])
  );

  if (isLoading && !reports) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const displayReports = reports || {
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
    rejectedRequests: 0,
    totalCollaborators: 0,
    totalManagers: 0,
    activeCollaborators: 0,
    pendingRegistrations: 0,
    newRequestsThisMonth: 0,
    approvedRequestsThisMonth: 0,
    newRegistrationsThisMonth: 0,
  };

  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <View style={styles.container}>
        {user?.role && <ProfileTag role={user.role} />}
        {/* Métricas */}
        <View style={styles.metricsRow}>
          <Card style={styles.metricCard} padding="md">
            <Text variant="body" color="text.secondary" style={styles.metricLabel}>
              Cadastros pendentes
            </Text>
            <Text variant="h1" weight="bold" style={styles.metricValue}>
              {displayReports.pendingRegistrations}
            </Text>
          </Card>
          
          <Card style={styles.metricCard} padding="md">
            <Text variant="body" color="text.secondary" style={styles.metricLabel}>
              Total de colaboradores ativos
            </Text>
            <Text variant="h1" weight="bold" style={styles.metricValue}>
              {displayReports.activeCollaborators}
            </Text>
          </Card>
        </View>

        <Card style={styles.metricCardFull} padding="md">
          <Text variant="body" color="text.secondary" style={styles.metricLabel}>
            Total de gestores
          </Text>
          <Text variant="h1" weight="bold" style={styles.metricValue}>
            {displayReports.totalManagers}
          </Text>
        </Card>

        <Spacer size="xl" />

        {/* Ações Rápidas */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Ações rápidas
        </Text>

        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PendingRegistrations')}
        >
          <Card style={styles.actionCard} padding="md">
            <View style={styles.actionContent}>
              <View style={styles.actionTextContainer}>
                <Text variant="h3" weight="bold" style={styles.actionTitle}>
                  Aprovar novos colaboradores
                </Text>
                <Text variant="body" weight="bold" style={styles.actionSubtitle}>
                  Novos membros
                </Text>
                <Spacer size="xs" />
                <Text variant="body" color="text.secondary">
                  Revise e aprove as solicitações de novos colaboradores.
                </Text>
              </View>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=150&fit=crop' }}
                style={styles.actionImage}
                resizeMode="cover"
              />
            </View>
          </Card>
        </TouchableOpacity>

        <Spacer size="md" />

        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => {
            // Navega para a tab de usuários
            const parentNavigation = navigation.getParent();
            if (parentNavigation) {
              parentNavigation.navigate('Users');
            }
          }}
        >
          <Card style={styles.actionCard} padding="md">
            <View style={styles.actionContent}>
              <View style={styles.actionTextContainer}>
                <Text variant="h3" weight="bold" style={styles.actionTitle}>
                  Visualizar usuários
                </Text>
                <Text variant="body" weight="bold" style={styles.actionSubtitle}>
                  Gerenciar usuários
                </Text>
                <Spacer size="xs" />
                <Text variant="body" color="text.secondary">
                  Consulte a lista completa de usuários e suas informações.
                </Text>
              </View>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=150&fit=crop' }}
                style={styles.actionImage}
                resizeMode="cover"
              />
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};
