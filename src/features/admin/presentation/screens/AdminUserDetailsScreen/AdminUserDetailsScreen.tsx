import React, { useState, useCallback } from 'react';
import { View, Alert } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
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
    department?: string;
    position?: string;
    phone?: string;
  };
};

export const AdminUserDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { updateUserStatus, isLoading, fetchUsers, users } = useAdminStore();
  
  // Busca dados atualizados do store quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      fetchUsers(undefined, false).catch(() => {});
    }, [fetchUsers])
  );

  // Usa dados do store se disponível, senão usa dos params
  const storeUser = users.find(u => u.id === route.params?.userId);
  const displayData = storeUser ? {
    userId: storeUser.id,
    name: storeUser.name,
    email: storeUser.email,
    role: storeUser.role,
    status: storeUser.status === 'active' ? 'Ativo' : 'Inativo',
    createdAt: route.params?.createdAt || 'Data não disponível',
    department: storeUser.department,
    position: storeUser.position,
    phone: storeUser.phone,
  } : route.params;

  const { userId, name, email, role, status, createdAt } = displayData || {
    userId: '',
    name: 'Ricardo Almeida',
    email: 'ricardo.almeida@email.com',
    role: 'Colaborador',
    status: 'Ativo',
    createdAt: '15 de março de 2023',
  };
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<ToastProps>({
    visible: false,
    message: '',
    variant: 'success',
  });
  
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
  const isActive = status === 'Ativo' || status === 'active';

  const handleChangeProfile = () => {
    navigation.navigate('UpdateProfile', {
      userId,
      currentRole: role,
      currentDepartment: displayData?.department,
      currentPosition: displayData?.position,
      currentPhone: displayData?.phone,
    });
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
          <View style={styles.separator} />
          
          <View style={styles.infoRow}>
            <Text variant="body" color="text.secondary" style={styles.infoLabel}>
              Perfil
            </Text>
            <Text variant="caption" weight="bold">
              {role}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text variant="body" color="text.secondary" style={styles.infoLabel}>
              Status
            </Text>
            <Text variant="caption" weight="bold">
              {status}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text variant="body" color="text.secondary" style={styles.infoLabel}>
              Criado em
            </Text>
            <Text variant="caption" weight="bold">
              {createdAt}
            </Text>
          </View>
        </Card>

        <Spacer size="lg" />

        {/* Informações adicionais */}
        <Card style={styles.infoCard} padding="md">
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Informações adicionais
          </Text>
          <View style={styles.separator} />
          
          {(displayData?.department || displayData?.position || displayData?.phone) ? (
            <>
              {displayData?.department && (
                <View style={styles.infoRow}>
                  <Text variant="body" color="text.secondary" style={styles.infoLabel}>
                    Departamento
                  </Text>
                  <Text variant="caption" weight="bold">
                    {displayData.department}
                  </Text>
                </View>
              )}

              {displayData?.position && (
                <View style={styles.infoRow}>
                  <Text variant="body" color="text.secondary" style={styles.infoLabel}>
                    Cargo
                  </Text>
                  <Text variant="caption" weight="bold">
                    {displayData.position}
                  </Text>
                </View>
              )}

              {displayData?.phone && (
                <View style={styles.infoRow}>
                  <Text variant="body" color="text.secondary" style={styles.infoLabel}>
                    Telefone
                  </Text>
                  <Text variant="caption" weight="bold">
                    {displayData.phone}
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

