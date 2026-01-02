import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { 
  ScreenContainer, 
  ProfileHeader, 
  Text, 
  Spacer,
  ListSection,
  Button
} from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { useManagerStore } from '../../store/useManagerStore';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';

export const ManagerProfileScreen = () => {
  const { signOut } = useAuthStore();
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
      </ListSection>

      <Spacer size="xl" />
      
      <View style={styles.logoutContainer}>
        <Button 
          title="Sair" 
          variant="outline" 
          onPress={signOut}
        />
      </View>
    </ScreenContainer>
  );
};
