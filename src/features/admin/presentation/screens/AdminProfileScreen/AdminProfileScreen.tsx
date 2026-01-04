import React, { useEffect, useState } from 'react';
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
import { getDocumentSnapshot } from '../../../../../core/facades/database.facade';

interface ProfileData {
  department?: string;
  position?: string;
  phone?: string;
}

export const AdminProfileScreen = () => {
  const { user } = useAuthStore();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const profile = await getDocumentSnapshot<ProfileData>('profiles', user.id);
        setProfileData(profile || null);
      } catch (error) {
        // Silently fail - profile data is optional
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

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
    department: profileData?.department,
    position: profileData?.position,
    phone: profileData?.phone,
  };

  if (isLoadingProfile) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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

