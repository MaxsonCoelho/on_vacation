import React, { useCallback, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { 
  ScreenContainer, 
  Text, 
  Card, 
  Spacer 
} from '../../../../../core/design-system';
import { useAdminStore } from '../../store/useAdminStore';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';

export const AdminReportsScreen = () => {
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
        {/* Métricas Gerais */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Visão Geral
        </Text>

        <View style={styles.metricsRow}>
          <Card style={styles.metricCard} padding="md">
            <Text variant="body" color="text.secondary" style={styles.metricLabel}>
              Total de Solicitações
            </Text>
            <Text variant="h1" weight="bold" style={styles.metricValue}>
              {displayReports.totalRequests}
            </Text>
          </Card>
          
          <Card style={styles.metricCard} padding="md">
            <Text variant="body" color="text.secondary" style={styles.metricLabel}>
              Solicitações Aprovadas
            </Text>
            <Text variant="h1" weight="bold" style={[styles.metricValue, styles.approvedValue]}>
              {displayReports.approvedRequests}
            </Text>
          </Card>
        </View>

        <View style={styles.metricsRow}>
          <Card style={styles.metricCard} padding="md">
            <Text variant="body" color="text.secondary" style={styles.metricLabel}>
              Solicitações Pendentes
            </Text>
            <Text variant="h1" weight="bold" style={[styles.metricValue, styles.pendingValue]}>
              {displayReports.pendingRequests}
            </Text>
          </Card>
          
          <Card style={styles.metricCard} padding="md">
            <Text variant="body" color="text.secondary" style={styles.metricLabel}>
              Solicitações Reprovadas
            </Text>
            <Text variant="h1" weight="bold" style={[styles.metricValue, styles.rejectedValue]}>
              {displayReports.rejectedRequests}
            </Text>
          </Card>
        </View>

        <Spacer size="xl" />

        {/* Estatísticas de Usuários */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Usuários do Sistema
        </Text>

        <Card style={styles.fullCard} padding="md">
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Total de Colaboradores</Text>
            <Text variant="title" weight="bold">{displayReports.totalCollaborators}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Total de Gestores</Text>
            <Text variant="title" weight="bold">{displayReports.totalManagers}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Colaboradores Ativos</Text>
            <Text variant="title" weight="bold">{displayReports.activeCollaborators}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Cadastros Pendentes</Text>
            <Text variant="title" weight="bold">{displayReports.pendingRegistrations}</Text>
          </View>
        </Card>

        <Spacer size="xl" />

        {/* Estatísticas do Mês */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Este Mês
        </Text>

        <Card style={styles.fullCard} padding="md">
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Novas Solicitações</Text>
            <Text variant="title" weight="bold">{displayReports.newRequestsThisMonth}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Solicitações Aprovadas</Text>
            <Text variant="title" weight="bold">{displayReports.approvedRequestsThisMonth}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Novos Cadastros</Text>
            <Text variant="title" weight="bold">{displayReports.newRegistrationsThisMonth}</Text>
          </View>
        </Card>

        <Spacer size="xl" />
      </View>
    </ScreenContainer>
  );
};

