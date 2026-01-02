import React from 'react';
import { View, Image } from 'react-native';
import { 
  ScreenContainer, 
  Text, 
  Card, 
  Avatar, 
  Spacer 
} from '../../../../../core/design-system';
import { styles } from './styles';

// Dados estáticos para o protótipo
const PENDING_REQUESTS = [
  {
    id: '1',
    name: 'Carlos Pereira',
    dateRange: '15/07/2024 - 29/07/2024',
    avatarUrl: 'https://i.pravatar.cc/150?u=carlos',
  },
  {
    id: '2',
    name: 'Ana Souza',
    dateRange: '22/07/2024 - 05/08/2024',
    avatarUrl: 'https://i.pravatar.cc/150?u=ana',
  },
  {
    id: '3',
    name: 'Ricardo Almeida',
    dateRange: '29/07/2024 - 12/08/2024',
    avatarUrl: 'https://i.pravatar.cc/150?u=ricardo',
  },
];

export const ManagerHomeScreen = () => {
  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <View style={styles.container}>
        {/* Saudação */}
        <View style={styles.greeting}>
          <Text variant="h1" weight="bold">
            Olá, Sr. Silva
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
              Você tem 3 solicitações de férias aguardando sua aprovação.
            </Text>
          </View>
        </Card>

        {/* Lista de Solicitações */}
        <View>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Pendentes Recentes
          </Text>

          <View style={styles.listContainer}>
            {PENDING_REQUESTS.slice(0, 3).map((request) => (
              <View key={request.id} style={styles.listItem}>
                <Avatar 
                  source={request.avatarUrl} 
                  size="md"
                  initials={request.name.split(' ').map(n => n[0]).join('')} 
                />
                <View style={styles.userInfo}>
                  <Text variant="body" weight="bold" style={styles.userName}>
                    {request.name}
                  </Text>
                  <Text variant="caption" style={styles.dateRange}>
                    {request.dateRange}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Spacer size="xl" />
      </View>
    </ScreenContainer>
  );
};
