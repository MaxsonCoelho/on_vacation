import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
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
  ToastProps
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
  const [toast, setToast] = useState<ToastProps>({
    visible: false,
    message: '',
    variant: 'success',
  });
  
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2);

  const handleApprove = async () => {
    Alert.alert(
      'Aprovar Cadastro',
      `Deseja aprovar o cadastro de ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprovar',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await approveUser(userId);
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
              setToast({
                visible: true,
                message: 'Não foi possível aprovar o cadastro. Tente novamente.',
                variant: 'error',
                onDismiss: () => setToast(prev => ({ ...prev, visible: false }))
              });
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    Alert.alert(
      'Rejeitar Cadastro',
      `Deseja rejeitar o cadastro de ${name}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rejeitar',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await rejectUser(userId);
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
              setToast({
                visible: true,
                message: 'Não foi possível rejeitar o cadastro. Tente novamente.',
                variant: 'error',
                onDismiss: () => setToast(prev => ({ ...prev, visible: false }))
              });
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
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
          
            {route.params?.department && (
              <View style={styles.infoRow}>
                <Text variant="body" color="text.secondary" style={styles.infoLabel}>
                  Departamento
                </Text>
                <Text variant="body" weight="bold">
                  {route.params.department}
                </Text>
              </View>
            )}

            {route.params?.position && (
              <View style={styles.infoRow}>
                <Text variant="body" color="text.secondary" style={styles.infoLabel}>
                  Cargo
                </Text>
                <Text variant="body" weight="bold">
                  {route.params.position}
                </Text>
              </View>
            )}

            {route.params?.phone && (
              <View style={styles.infoRow}>
                <Text variant="body" color="text.secondary" style={styles.infoLabel}>
                  Telefone
                </Text>
                <Text variant="body" weight="bold">
                  {route.params.phone}
                </Text>
              </View>
            )}
        </Card>

        <Spacer size="lg" />

        {/* Status do cadastro */}
        <Card style={styles.statusCard} padding="md">
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Status do cadastro
          </Text>
          <View style={styles.separator} />
            <Text variant="body" style={styles.statusText}>
              Pendente de aprovação
            </Text>
        </Card>

        <Spacer size="xl" />

          {/* Botões de ação */}
          <View style={styles.actionsContainer}>
            <Button
              title="Rejeitar"
              onPress={handleReject}
              variant="outline"
              style={styles.rejectButton}
              disabled={isProcessing || isLoading}
            />
            <Spacer size="md" horizontal />
            <Button
              title="Aprovar cadastro"
              onPress={handleApprove}
              variant="primary"
              style={styles.approveButton}
              disabled={isProcessing || isLoading}
            />
          </View>

        <Spacer size="lg" />
      </View>
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

