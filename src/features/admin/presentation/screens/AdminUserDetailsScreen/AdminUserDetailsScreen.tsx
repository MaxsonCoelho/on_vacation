import React, { useState } from 'react';
import { View, Alert } from 'react-native';
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
import { AdminUsersStackParamList } from '../../../../../app/navigation/admin/stacks/AdminUsersStack';

type NavigationProp = NativeStackNavigationProp<AdminUsersStackParamList>;
type RouteProp = {
  params: {
    userId: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  };
};

export const AdminUserDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { userId, name, email, role, status, createdAt } = route.params || {
    userId: '',
    name: 'Ricardo Almeida',
    email: 'ricardo.almeida@email.com',
    role: 'Colaborador',
    status: 'Ativo',
    createdAt: '15 de março de 2023',
  };
  
  const { updateUserStatus, isLoading } = useAdminStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<ToastProps>({
    visible: false,
    message: '',
    variant: 'success',
  });
  
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
  const isActive = status === 'Ativo' || status === 'active';

  const handleChangeProfile = () => {
    // TODO: Implementar alteração de perfil
  };

  const handleDeactivateUser = () => {
    Alert.alert(
      'Desativar Usuário',
      `Deseja desativar o usuário ${name}? Ele não poderá mais acessar o sistema.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desativar',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await updateUserStatus(userId, 'inactive');
              setToast({
                visible: true,
                message: 'Usuário desativado com sucesso!',
                variant: 'success',
                onDismiss: () => {
                  setToast(prev => ({ ...prev, visible: false }));
                  navigation.goBack();
                }
              });
            } catch (error) {
              console.error('[AdminUserDetails] Error deactivating user:', error);
              setToast({
                visible: true,
                message: 'Não foi possível desativar o usuário. Tente novamente.',
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

  const handleActivateUser = () => {
    Alert.alert(
      'Ativar Usuário',
      `Deseja ativar o usuário ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ativar',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await updateUserStatus(userId, 'active');
              setToast({
                visible: true,
                message: 'Usuário ativado com sucesso!',
                variant: 'success',
                onDismiss: () => {
                  setToast(prev => ({ ...prev, visible: false }));
                  navigation.goBack();
                }
              });
            } catch (error) {
              console.error('[AdminUserDetails] Error activating user:', error);
              setToast({
                visible: true,
                message: 'Não foi possível ativar o usuário. Tente novamente.',
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
          <Text variant="body" color="primary" style={styles.email}>
            {email}
          </Text>
          <Spacer size="sm" />
          <Text variant="body" style={styles.role}>
            {role}
          </Text>
        </Card>

        <Spacer size="lg" />

        {/* Informações */}
        <Card style={styles.infoCard} padding="md">
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Informações
          </Text>
          
          <View style={styles.infoRow}>
            <Text variant="body" color="text.secondary" style={styles.infoLabel}>
              Perfil
            </Text>
            <Text variant="body" weight="bold">
              {role}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text variant="body" color="text.secondary" style={styles.infoLabel}>
              Status
            </Text>
            <Text variant="body" weight="bold">
              {status}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text variant="body" color="text.secondary" style={styles.infoLabel}>
              Criado em
            </Text>
            <Text variant="body" weight="bold">
              {createdAt}
            </Text>
          </View>
        </Card>

        <Spacer size="lg" />

        {/* Ações */}
        <Card style={styles.actionsCard} padding="md">
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Ações
          </Text>
          
          <Spacer size="md" />
          
          <Button
            title="Solicitações"
            onPress={() => navigation.navigate('UserRequests', { userId, userName: name })}
            variant="outline"
            style={styles.actionButton}
          />
          
          <Spacer size="md" />
          
          <Button
            title="Alterar perfil"
            onPress={handleChangeProfile}
            variant="outline"
            style={styles.actionButton}
          />
          
          <Spacer size="md" />
          
          <Button
            title={isActive ? 'Desativar usuário' : 'Ativar usuário'}
            onPress={isActive ? handleDeactivateUser : handleActivateUser}
            variant="outline"
            style={[
              styles.actionButton,
              !isActive && { borderColor: theme.colors.success }
            ]}
            disabled={isProcessing || isLoading}
          />
        </Card>

        <Spacer size="xl" />
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

