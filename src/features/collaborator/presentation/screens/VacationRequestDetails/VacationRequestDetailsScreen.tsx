import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { 
  ScreenContainer, 
  Text, 
  Spacer,
  Icon,
  Button
} from '../../../../../core/design-system';
import { IconName, ThemeColor } from '../../../../../core/design-system/atoms/Icon/types';
import { styles } from './styles';
import { useVacationStore } from '../../store/useVacationStore';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { useProfileStore } from '../../store/useProfileStore';
import { VacationStackParamList } from '../../../../../app/navigation/collaborator/stacks/VacationStack';

type DetailsRouteProp = RouteProp<VacationStackParamList, 'VacationRequestDetails'>;

export const VacationRequestDetailsScreen = () => {
  const route = useRoute<DetailsRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { requests, subscribeToRealtime, unsubscribeFromRealtime } = useVacationStore();
  const { user } = useAuthStore();
  const { profile } = useProfileStore();

  useEffect(() => {
      if (user?.id) {
          subscribeToRealtime(user.id);
      }
      return () => unsubscribeFromRealtime();
  }, [user?.id, subscribeToRealtime, unsubscribeFromRealtime]);

  const request = requests.find(r => r.id === id);

  const requesterName = profile?.name || user?.name || 'Colaborador';

  if (!request) {
    return (
      <ScreenContainer edges={['left', 'right']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text variant="body" color="text.secondary">Solicitação não encontrada.</Text>
          <Spacer size="md" />
          <Button title="Voltar" onPress={() => navigation.goBack()} variant="secondary" />
        </View>
      </ScreenContainer>
    );
  }

  const getTimeline = () => {
    const timeline = [
      { id: '1', label: 'Solicitado', status: 'completed' },
      { id: '2', label: 'Análise do Gestor', status: 'pending' },
      { id: '3', label: 'Concluído', status: 'pending' },
    ];

    if (request.status === 'approved') {
      timeline[1].status = 'completed';
      timeline[1].label = 'Aprovado';
    } else if (request.status === 'rejected') {
      timeline[1].status = 'error';
      timeline[1].label = 'Reprovado';
    } else if (request.status === 'completed') {
      timeline[1].status = 'completed';
      timeline[1].label = 'Aprovado';
      timeline[2].status = 'completed';
    }

    return timeline;
  };

  const statusTimeline = getTimeline();

  const renderTimelineItem = (item: { id: string, label: string, status: string }, index: number, total: number) => {
    const isLast = index === total - 1;
    let iconName: IconName = 'circle-outline';
    let iconColor: ThemeColor = 'text.disabled';

    if (item.status === 'completed') {
      iconName = 'check-circle';
      iconColor = 'status.success';
    } else if (item.status === 'error') {
      iconName = 'close-circle';
      iconColor = 'status.error';
    } else if (item.label === 'Solicitado') {
        iconName = 'check-circle';
        iconColor = 'status.success';
    }

    return (
      <View key={item.id} style={styles.timelineItem}>
        <View style={styles.timelineLeft}>
          <View style={styles.timelineIconContainer}>
             <Icon name={iconName} size={24} color={iconColor} />
          </View>
          {!isLast && <View style={styles.timelineLine} />}
        </View>
        <View style={styles.timelineContent}>
          <Text variant="body" weight="regular" style={styles.timelineText}>
            {item.label}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerInfo}>
            <Text variant="caption" color="primary">
              Solicitação de Férias
            </Text>
            <Spacer size="xs" />
            <Text variant="h3" weight="bold">
              Período: {request.startDate} - {request.endDate}
            </Text>
            <Spacer size="xs" />
            <Text variant="caption" color="primary">
              Solicitante: {requesterName}
            </Text>
          </View>
          <View style={styles.headerIconCard}>
             <Icon name="calendar-blank" size={32} color="primary" />
          </View>
        </View>

        <Spacer size="xl" />

        {/* Collaborator Notes */}
        <View>
          <Text variant="h3" weight="bold">
            Observações do Colaborador
          </Text>
          <Spacer size="sm" />
          <Text variant="body" color="text.secondary">
            {request.collaboratorNotes || 'Nenhuma observação.'}
          </Text>
        </View>

        <Spacer size="xl" />

        {/* Manager Notes */}
        {request.managerNotes && (
          <>
            <View>
              <Text variant="h3" weight="bold">
                Observações do Gestor
              </Text>
              <Spacer size="sm" />
              <Text variant="body" color="text.secondary">
                {request.managerNotes}
              </Text>
            </View>
            <Spacer size="xl" />
          </>
        )}
        
        {/* Timeline */}
         <View>
          <Text variant="h3" weight="bold">
            Histórico
          </Text>
          <Spacer size="md" />
          {statusTimeline.map((item, index) => 
            renderTimelineItem(item, index, statusTimeline.length)
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};
