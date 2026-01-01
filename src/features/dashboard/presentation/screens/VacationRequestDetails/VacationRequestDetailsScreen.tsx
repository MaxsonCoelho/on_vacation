import React from 'react';
import { View } from 'react-native';
import { 
  ScreenContainer, 
  Text, 
  Spacer,
  Icon,
  Button
} from '../../../../../core/design-system';
import { styles } from './styles';

export const VacationRequestDetailsScreen = () => {
  // Mock data matching the prototype
  const requestDetails = {
    period: '15/07/2024 - 29/07/2024',
    requester: 'Mariana Silva',
    collaboratorNotes: 'Gostaria de solicitar minhas férias para o período mencionado. Agradeço a atenção.',
    managerNotes: 'Solicitação aprovada. Aproveite suas férias, Mariana!',
    statusTimeline: [
      { id: '1', label: 'Solicitado', status: 'completed' },
      { id: '2', label: 'Aprovado', status: 'completed' },
      { id: '3', label: 'Concluído', status: 'completed' },
    ]
  };

  const renderTimelineItem = (item: { id: string, label: string, status: string }, index: number, total: number) => {
    const isLast = index === total - 1;
    
    return (
      <View key={item.id} style={styles.timelineItem}>
        <View style={styles.timelineLeft}>
          <View style={styles.timelineIconContainer}>
             {item.label === 'Solicitado' ? (
                 <Icon name="clock-outline" size={20} color="text.primary" />
             ) : (
                 <Icon name="check" size={20} color="text.primary" />
             )}
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
    <ScreenContainer scrollable>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerInfo}>
            <Text variant="caption" color="primary">
              Solicitação de Férias
            </Text>
            <Spacer size="xs" />
            <Text variant="h3" weight="bold">
              Período: {requestDetails.period}
            </Text>
            <Spacer size="xs" />
            <Text variant="caption" color="primary">
              Solicitante: {requestDetails.requester}
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
            {requestDetails.collaboratorNotes}
          </Text>
        </View>

        <Spacer size="xl" />

        {/* Manager Notes */}
        <View>
          <Text variant="h3" weight="bold">
            Observações do Gestor
          </Text>
          <Spacer size="sm" />
          <Text variant="body" color="text.secondary">
            {requestDetails.managerNotes}
          </Text>
        </View>

        <Spacer size="xl" />

        {/* Status Timeline */}
        <View>
          <Text variant="h3" weight="bold">
            Status da Solicitação
          </Text>
          <Spacer size="md" />
          <View style={styles.timelineContainer}>
            {requestDetails.statusTimeline.map((item, index) => 
              renderTimelineItem(item, index, requestDetails.statusTimeline.length)
            )}
          </View>
        </View>

        <Spacer size="xl" />
        <Spacer size="xl" />

        {/* Footer Status Button */}
        <Button 
            title="Aprovado"
            variant="primary"
            leftIcon="check"
            onPress={() => {}}
            style={{ alignSelf: 'flex-end' }}
            activeOpacity={1}
        />
        
      </View>
    </ScreenContainer>
  );
};
