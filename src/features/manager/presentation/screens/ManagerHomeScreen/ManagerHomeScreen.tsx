import React, { useCallback, useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { 
  ScreenContainer, 
  Text, 
  Card, 
  Avatar, 
  Spacer 
} from '../../../../../core/design-system';
import { styles } from './styles';
import { useManagerStore } from '../../store/useManagerStore';
import { theme } from '../../../../../core/design-system/tokens';
import { formatDate } from '../../../../../core/utils';

export const ManagerHomeScreen = () => {
  const { profile, requests, isLoading, fetchProfile, fetchRequests, subscribeToRealtime, unsubscribeFromRealtime } = useManagerStore();

  useEffect(() => {
    subscribeToRealtime();
    return () => unsubscribeFromRealtime();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchRequests('Pendentes');
    }, [])
  );

  const pendingRequests = requests
    .filter(r => r.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

 if (isLoading && !profile) {
         return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
               <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
         );
      }
      
      return (
        <ScreenContainer scrollable edges={['left', 'right']}>
      <View style={styles.container}>
        {/* Saudação */}
        <View style={styles.greeting}>
          <Text variant="h1" weight="bold">
            Olá, {profile?.name || 'Gestor'}
          </Text>
        </View>

        {/* Banner de Solicitações Pendentes */}
        <Card style={styles.bannerCard} padding="lg">
          {/* Imagem de fundo simulada ou real se disponível */}
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerContent}>
            <Text variant="h2" weight="bold" style={styles.bannerTitle}>
              Solicitações Pendentes
            </Text>
            <Text variant="body" style={styles.bannerDescription}>
              Você tem {pendingRequests.length} solicitações de férias aguardando sua aprovação.
            </Text>
          </View>
        </Card>

        {/* Lista de Solicitações */}
        <View>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Pendentes Recentes
          </Text>

          <View style={styles.listContainer}>
            {pendingRequests.length === 0 ? (
                 <Text variant="body" style={{ color: theme.colors.text.secondary, marginTop: 10 }}>Nenhuma solicitação pendente.</Text>
            ) : (
                pendingRequests.slice(0, 3).map((request) => (
                  <View key={request.id} style={styles.listItem}>
                    <Avatar 
                      source={request.employeeAvatarUrl} 
                      size="md"
                      initials={request.employeeName.split(' ').map(n => n[0]).join('')} 
                    />
                    <View style={styles.userInfo}>
                      <Text variant="body" weight="bold" style={styles.userName}>
                        {request.employeeName}
                      </Text>
                      <Text variant="caption" style={styles.dateRange}>
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </Text>
                    </View>
                  </View>
                ))
            )}
          </View>
        </View>

        <Spacer size="xl" />
      </View>
    </ScreenContainer>
  );
};
