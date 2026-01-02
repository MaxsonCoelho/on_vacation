import React from 'react';
import { View } from 'react-native';
import { 
  ScreenContainer, 
  ProfileHeader, 
  Text, 
  Spacer,
  ListSection,
  Button
} from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { styles } from './styles';

export const ManagerProfileScreen = () => {
  const { user, signOut } = useAuthStore();

  const userDisplay = {
    name: user?.name || 'Gestor',
    role: user?.role || 'Gestor',
    email: user?.email || '',
    avatar: undefined,
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
