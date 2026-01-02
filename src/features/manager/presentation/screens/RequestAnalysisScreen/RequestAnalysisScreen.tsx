import React from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
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
import { useManagerStore } from '../../store/useManagerStore';
import { formatDate } from '../../../../../core/utils';

type Props = NativeStackScreenProps<ManagerRequestsStackParamList, 'RequestAnalysis'>;

export const RequestAnalysisScreen: React.FC<Props> = ({ navigation, route }) => {
  const { id } = route.params;
  const { requests, approveRequest, rejectRequest, isLoading } = useManagerStore();

  const request = requests.find(r => r.id === id);

  const handleApprove = async () => {
    try {
        await approveRequest(id, 'Aprovado pelo gestor');
        Alert.alert('Sucesso', 'Solicitação aprovada com sucesso!', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível aprovar a solicitação.');
    }
  };

  const handleReject = async () => {
    try {
        await rejectRequest(id, 'Reprovado pelo gestor');
        Alert.alert('Sucesso', 'Solicitação reprovada com sucesso!', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível reprovar a solicitação.');
    }
  };

  if (!request) {
      return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text variant="body">Solicitação não encontrada.</Text>
          </View>
      );
  }

  if (isLoading) {
       return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
             <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
       );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScreenContainer scrollable edges={['left', 'right']}>
        {/* Solicitante */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Solicitante
        </Text>
        <View style={styles.requesterContainer}>
          <Avatar 
            source={request.employeeAvatarUrl} 
            size="lg" 
            initials={request.employeeName.split(' ').map(n => n[0]).join('')}
          />
          <View style={styles.requesterInfo}>
            <Text variant="body" weight="bold">
              {request.employeeName}
            </Text>
            {/* <Text variant="body" style={styles.requesterRole}>
              {request.role}
            </Text> */}
          </View>
        </View>

        {/* Período */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Período
        </Text>
        <View style={styles.periodContainer}>
          <Text variant="body">
            {formatDate(request.startDate)} - {formatDate(request.endDate)}
          </Text>
          {/* <Text variant="body" style={styles.durationText}>
            {request.duration}
          </Text> */}
        </View>

        {/* Observações */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Observações
        </Text>
        <View style={styles.observationsContainer}>
          <Text variant="body" color="text.secondary">
            {request.notes || 'Nenhuma observação'}
          </Text>
        </View>
        
        <Spacer size="xl" />
      </ScreenContainer>

      {request.status === 'pending' && (
          <ApprovalActionBar 
            onApprove={handleApprove}
            onReject={handleReject}
            approveLabel="Aprovar"
            rejectLabel="Reprovar"
            approveButtonProps={{
              style: { backgroundColor: theme.colors.brand.manager },
            }}
          />
      )}
    </View>
  );
};
