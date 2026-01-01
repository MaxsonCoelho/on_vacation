import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { 
  ScreenContainer, 
  ProfileHeader, 
  Text, 
  Spacer,
  ListSection
} from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { useProfileStore } from '../../store/useProfileStore';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';

export const ProfileScreen = () => {
  const { user: authUser } = useAuthStore();
  const { profile, fetchProfile, isLoading } = useProfileStore();

  useEffect(() => {
    if (authUser?.id) {
      fetchProfile(authUser.id);
    }
  }, [authUser?.id, fetchProfile]);

  if (isLoading && !profile) {
    return (
      <ScreenContainer edges={['left', 'right']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  const userDisplay = profile || {
    id: authUser?.id || '',
    name: authUser?.name || 'Colaborador',
    role: authUser?.role || 'Colaborador',
    department: 'Setor',
    admissionDate: '01/01/2023',
    email: authUser?.email || '',
    avatar: undefined,
    vacationBalance: 0,
    vacationPeriodStart: '',
    vacationPeriodEnd: ''
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
          <Text variant="body" style={{ fontSize: RFValue(12) }}>{userDisplay.email}</Text>
        </View>
        <Spacer size="sm" />
        <View style={styles.infoRow}>
          <Text variant="body" color="text.secondary">Setor</Text>
          <Text variant="body" style={{ fontSize: RFValue(12) }}>{userDisplay.department}</Text>
        </View>
        <Spacer size="sm" />
        <View style={styles.infoRow}>
          <Text variant="body" color="text.secondary">Admissão</Text>
          <Text variant="body" style={{ fontSize: RFValue(12) }}>{userDisplay.admissionDate}</Text>
        </View>
      </ListSection>
    </ScreenContainer>
  );
};
