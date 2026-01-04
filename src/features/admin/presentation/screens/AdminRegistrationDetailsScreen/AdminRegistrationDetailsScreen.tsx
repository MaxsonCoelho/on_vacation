import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  ScreenContainer, 
  Text, 
  Avatar, 
  Button,
  Spacer,
  Card,
  Toast,
  ToastProps,
  Dialog
} from '../../../../../core/design-system';
import { useAdminStore } from '../../store/useAdminStore';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';
import { AdminHomeStackParamList } from '../../../../../app/navigation/admin/stacks/AdminHomeStack';
import { formatDate } from '../../../../../core/utils/date';

type NavigationProp = NativeStackNavigationProp<AdminHomeStackParamList>;
type RouteProp = {
  params: {
    userId: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    position?: string;
    phone?: string;
    registrationDate?: string;
  };
};

export const AdminRegistrationDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { userId, name, email, role } = route.params || { 
    userId: '', 
    name: '', 
    email: '', 
    role: '' 
  };
  
  const { approveUser, rejectUser, isLoading } = useAdminStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [toast, setToast] = useState<ToastProps>({
    visible: false,
    message: '',
    variant: 'success',
  });
  
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2);

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      await approveUser(userId);
      setShowApproveDialog(false);
      setToast({
        visible: true,
        message: 'Cadastro aprovado com sucesso!',
        variant: 'success',
        onDismiss: () => {
          setToast(prev => ({ ...prev, visible: false }));
          navigation.goBack();
        }
      });
    } catch (error) {
      console.error('[AdminRegistrationDetails] Error approving user:', error);
      setShowApproveDialog(false);
      setToast({
        visible: true,
        message: 'Não foi possível aprovar o cadastro. Tente novamente.',
        variant: 'error',
        onDismiss: () => setToast(prev => ({ ...prev, visible: false }))
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsProcessing(true);
      await rejectUser(userId);
      setShowRejectDialog(false);
      setToast({
        visible: true,
        message: 'Cadastro rejeitado.',
        variant: 'success',
        onDismiss: () => {
          setToast(prev => ({ ...prev, visible: false }));
          navigation.goBack();
        }
      });
    } catch (error) {
      console.error('[AdminRegistrationDetails] Error rejecting user:', error);
      setShowRejectDialog(false);
      setToast({
        visible: true,
        message: 'Não foi possível rejeitar o cadastro. Tente novamente.',
        variant: 'error',
        onDismiss: () => setToast(prev => ({ ...prev, visible: false }))
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <View style={styles.container}>
        {/* Avatar e informações principais */}
        <Card style={styles.profileCard} padding="lg">
          <View style={styles.avatarContainer}>
            <Avatar 
              source={undefined}
              size="xl"
              initials={initials}
            />
          </View>
          <Spacer size="md" />
          <Text variant="h1" weight="bold" style={styles.name}>
            {name}
          </Text>
          <Spacer size="xs" />
          <Text variant="body" color="text.secondary" style={styles.email}>
            {email}
          </Text>
          <Spacer size="sm" />
          <Text variant="body" color="text.secondary" style={styles.registrationInfo}>
            Perfil solicitado: {role} • Data de cadastro: {route.params?.registrationDate || 'Data não disponível'}
          </Text>
        </Card>

        <Spacer size="lg" />

        {/* Informações adicionais */}
        <Card style={styles.infoCard} padding="md">
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Informações adicionais
          </Text>
          <View style={styles.separator} />
          
          {route.params?.department || route.params?.position || route.params?.phone ? (
            <>
              {route.params?.department && (
                <View style={styles.infoRow}>
                  <Text variant="body" color="text.secondary" style={styles.infoLabel}>
                    Departamento
                  </Text>
                  <Text variant="caption" weight="bold">
                    {route.params.department}
                  </Text>
                </View>
              )}

              {route.params?.position && (
                <View style={styles.infoRow}>
                  <Text variant="body" color="text.secondary" style={styles.infoLabel}>
                    Cargo
                  </Text>
                  <Text variant="caption" weight="bold">
                    {route.params.position}
                  </Text>
                </View>
              )}

              {route.params?.phone && (
                <View style={styles.infoRow}>
                  <Text variant="body" color="text.secondary" style={styles.infoLabel}>
                    Telefone
                  </Text>
                  <Text variant="caption" weight="bold">
                    {route.params.phone}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <Text variant="body" color="text.secondary" style={styles.noAdditionalInfo}>
              Nenhuma informação adicional fornecida pelo usuário.
            </Text>
          )}
        </Card>

        <Spacer size="lg" />

        {/* Status do cadastro */}
        <Card style={styles.statusCard} padding="md">
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Status do cadastro
          </Text>
          <View style={styles.separator} />
            <Text variant="caption" style={styles.statusText}>
              Pendente de aprovação
            </Text>
        </Card>

        <Spacer size="xl" />

          {/* Botões de ação */}
          <View style={styles.actionsContainer}>
            <Button
              title="Rejeitar"
              onPress={() => setShowRejectDialog(true)}
              variant="outline"
              style={styles.rejectButton}
              disabled={isProcessing || isLoading}
            />
            <Spacer size="md" horizontal />
            <Button
              title="Aprovar cadastro"
              onPress={() => setShowApproveDialog(true)}
              variant="primary"
              style={styles.approveButton}
              disabled={isProcessing || isLoading}
            />
          </View>

        <Spacer size="lg" />
      </View>
      <Dialog
        visible={showApproveDialog}
        title="Aprovar Cadastro"
        message={`Deseja aprovar o cadastro de ${name}?`}
        onClose={() => setShowApproveDialog(false)}
        actions={[
          {
            text: 'Cancelar',
            onPress: () => setShowApproveDialog(false),
            variant: 'outline'
          },
          {
            text: 'Aprovar',
            onPress: handleApprove,
            variant: 'primary'
          }
        ]}
      />
      <Dialog
        visible={showRejectDialog}
        title="Rejeitar Cadastro"
        message={`Deseja rejeitar o cadastro de ${name}? Esta ação não pode ser desfeita.`}
        onClose={() => setShowRejectDialog(false)}
        actions={[
          {
            text: 'Cancelar',
            onPress: () => setShowRejectDialog(false),
            variant: 'outline'
          },
          {
            text: 'Rejeitar',
            onPress: handleReject,
            variant: 'primary'
          }
        ]}
      />
      <Toast
        visible={toast.visible}
        message={toast.message}
        variant={toast.variant}
        duration={1500}
        onDismiss={toast.onDismiss}
      />
    </ScreenContainer>
  );
};

