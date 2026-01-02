import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { 
  ScreenContainer, 
  ProfileHeader, 
  Text, 
  Spacer,
  ListSection
} from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';

export const AdminProfileScreen = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const userDisplay = {
    name: user.name || 'Administrador',
    role: user.role || 'Administrador',
    email: user.email || '',
    avatar: user.avatar,
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
    </ScreenContainer>
  );
};

