import React from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ManagerRequestsStackParamList } from '../../../../../app/navigation/manager/stacks/ManagerRequestsStack';
import { 
  ScreenContainer, 
  Text, 
  Avatar, 
  ApprovalActionBar,
  Spacer
} from '../../../../../core/design-system';
import { theme } from '../../../../../core/design-system/tokens';
import { styles } from './styles';

type Props = NativeStackScreenProps<ManagerRequestsStackParamList, 'RequestAnalysis'>;

// Dados mockados para simulação
const MOCK_REQUEST_DETAILS = {
  id: '1',
  name: 'Lucas Oliveira',
  role: 'Analista de Marketing',
  avatarUrl: 'https://i.pravatar.cc/150?u=lucas',
  dateRange: '01/07/2024 - 10/07/2024',
  duration: '10 dias',
  observations: 'Nenhuma observação',
};

export const RequestAnalysisScreen: React.FC<Props> = ({ navigation, route }) => {
  const { id } = route.params;

  // Em um cenário real, buscaríamos os detalhes pelo ID
  // const request = useRequestDetails(id);
  const request = MOCK_REQUEST_DETAILS; 

  const handleApprove = () => {
    console.log('Aprovado:', id);
    navigation.goBack();
  };

  const handleReject = () => {
    console.log('Reprovado:', id);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScreenContainer scrollable edges={['left', 'right']}>
        {/* Solicitante */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Solicitante
        </Text>
        <View style={styles.requesterContainer}>
          <Avatar 
            source={request.avatarUrl} 
            size="lg" 
            initials={request.name.split(' ').map(n => n[0]).join('')}
          />
          <View style={styles.requesterInfo}>
            <Text variant="body" weight="bold">
              {request.name}
            </Text>
            <Text variant="body" style={styles.requesterRole}>
              {request.role}
            </Text>
          </View>
        </View>

        {/* Período */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Período
        </Text>
        <View style={styles.periodContainer}>
          <Text variant="body">
            {request.dateRange}
          </Text>
          <Text variant="body" style={styles.durationText}>
            {request.duration}
          </Text>
        </View>

        {/* Observações */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Observações
        </Text>
        <View style={styles.observationsContainer}>
          <Text variant="body" color="text.secondary">
            {request.observations}
          </Text>
        </View>
        
        <Spacer size="xl" />
      </ScreenContainer>

      <ApprovalActionBar 
        onApprove={handleApprove}
        onReject={handleReject}
        approveLabel="Aprovar"
        rejectLabel="Reprovar"
        approveButtonProps={{
          style: { backgroundColor: theme.colors.brand.manager },
          textStyle: { color: '#FFFFFF' },
        }}
        style={{
          paddingHorizontal: theme.spacing.md,
          paddingTop: theme.spacing.md,
          paddingBottom: theme.spacing.sm,
          borderTopWidth: 0,
        }}
      />
    </View>
  );
};
