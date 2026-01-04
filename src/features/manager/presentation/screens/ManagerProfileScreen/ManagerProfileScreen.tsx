import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { 
  ScreenContainer, 
  ProfileHeader, 
  Text, 
  Spacer,
  ListSection
} from '../../../../../core/design-system';
import { useManagerStore } from '../../store/useManagerStore';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';

export const ManagerProfileScreen = () => {
  const { profile, fetchProfile, isLoading } = useManagerStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading && !profile) {
      return (
         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
         </View>
      );
  }

  const userDisplay = {
    name: profile?.name || 'Gestor',
    role: profile?.role ? 'Gestor' : 'Gestor', // Force 'Gestor' display
    email: profile?.email || '',
    avatar: profile?.avatarUrl,
    department: profile?.department,
    position: profile?.position,
    phone: profile?.phone,
  };

  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <ProfileHeader
        name={userDisplay.name}
        role={userDisplay.role}
        avatarUrl={userDisplay.avatar}
      />
      <Spacer size="xl" />
      
      <ListSection title="Informações Pessoais">
        <View style={styles.infoRow}>
          <Text variant="body" color="text.secondary">E-mail</Text>
          <Text variant="body">{userDisplay.email}</Text>
        </View>
        {userDisplay.department && (
          <>
            <Spacer size="sm" />
            <View style={styles.infoRow}>
              <Text variant="body" color="text.secondary">Departamento</Text>
              <Text variant="body">{userDisplay.department}</Text>
            </View>
          </>
        )}
      </ListSection>

      {(userDisplay.position || userDisplay.phone) && (
        <>
          <Spacer size="lg" />
          <ListSection title="Informações Adicionais">
            {userDisplay.position && (
              <>
                <View style={styles.infoRow}>
                  <Text variant="body" color="text.secondary">Cargo</Text>
                  <Text variant="caption">{userDisplay.position}</Text>
                </View>
                {userDisplay.phone && <Spacer size="sm" />}
              </>
            )}
            {userDisplay.phone && (
              <View style={styles.infoRow}>
                <Text variant="body" color="text.secondary">Telefone</Text>
                <Text variant="caption">{userDisplay.phone}</Text>
              </View>
            )}
          </ListSection>
        </>
      )}
    </ScreenContainer>
  );
};
