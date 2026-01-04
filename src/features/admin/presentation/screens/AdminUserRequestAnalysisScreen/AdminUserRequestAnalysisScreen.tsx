import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminUsersStackParamList } from '../../../../../app/navigation/admin/stacks/AdminUsersStack';
import { 
  ScreenContainer, 
  Text, 
  Avatar, 
  ApprovalActionBar,
  Spacer,
  Toast,
  ToastProps
} from '../../../../../core/design-system';
import { theme } from '../../../../../core/design-system/tokens';
import { styles } from './styles';
import { useAdminStore } from '../../store/useAdminStore';
import { formatDate } from '../../../../../core/utils';

type Props = NativeStackScreenProps<AdminUsersStackParamList, 'UserRequestAnalysis'>;

export const AdminUserRequestAnalysisScreen: React.FC<Props> = ({ navigation, route }) => {
  const { id, userId, userName } = route.params;
  const { userRequests, approveRequest, rejectRequest, isLoading } = useAdminStore();
  const [toast, setToast] = useState<ToastProps>({
    visible: false,
    message: '',
    variant: 'success',
  });

  const request = userRequests.find(r => r.id === id);

  const handleApprove = async () => {
    try {
      await approveRequest(id, 'Aprovado pelo administrador');
      setToast({
        visible: true,
        message: 'Solicitação aprovada com sucesso!',
        variant: 'success',
        onDismiss: () => {
          setToast(prev => ({ ...prev, visible: false }));
          navigation.goBack();
        }
      });
    } catch (error) {
      console.error(error);
      setToast({
        visible: true,
        message: 'Não foi possível aprovar a solicitação.',
        variant: 'error',
        onDismiss: () => setToast(prev => ({ ...prev, visible: false }))
      });
    }
  };

  const handleReject = async () => {
    try {
      await rejectRequest(id, 'Reprovado pelo administrador');
      setToast({
        visible: true,
        message: 'Solicitação reprovada com sucesso!',
        variant: 'success',
        onDismiss: () => {
          setToast(prev => ({ ...prev, visible: false }));
          navigation.goBack();
        }
      });
    } catch (error) {
      console.error(error);
      setToast({
        visible: true,
        message: 'Não foi possível reprovar a solicitação.',
        variant: 'error',
        onDismiss: () => setToast(prev => ({ ...prev, visible: false }))
      });
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

  const employeeInitials = request.employeeName.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScreenContainer scrollable edges={['left', 'right']}>
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Solicitante
        </Text>
        <View style={styles.requesterContainer}>
          <Avatar 
            source={request.employeeAvatarUrl} 
            size="lg" 
            initials={employeeInitials}
          />
          <View style={styles.requesterInfo}>
            <Text variant="body" weight="bold">
              {request.employeeName}
            </Text>
          </View>
        </View>

        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Título
        </Text>
        <View style={styles.titleContainer}>
          <Text variant="body">
            {request.title}
          </Text>
        </View>

        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Período
        </Text>
        <View style={styles.periodContainer}>
          <Text variant="body">
            {formatDate(request.startDate)} - {formatDate(request.endDate)}
          </Text>
        </View>

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
            style: { backgroundColor: theme.colors.brand.admin },
          }}
        />
      )}
      <Toast
        visible={toast.visible}
        message={toast.message}
        variant={toast.variant}
        duration={1500}
        onDismiss={toast.onDismiss}
      />
    </View>
  );
};

