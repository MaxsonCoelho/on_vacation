import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, Text, Avatar } from '../../../../../core/design-system';
import { FlashList } from '@shopify/flash-list';
import { styles } from './styles';
import { AdminHomeStackParamList } from '../../../../../app/navigation/admin/stacks/AdminHomeStack';

type NavigationProp = NativeStackNavigationProp<AdminHomeStackParamList>;

interface PendingUser {
  id: string;
  name: string;
  role: string;
  email: string;
}

// Dados estáticos baseados no protótipo
const PENDING_USERS: PendingUser[] = [
  {
    id: '1',
    name: 'João Silva',
    role: 'Analista de Marketing',
    email: 'joao.silva@email.com',
  },
  {
    id: '2',
    name: 'Maria Santos',
    role: 'Desenvolvedora Front-end',
    email: 'maria.santos@email.com',
  },
  {
    id: '3',
    name: 'Carlos Pereira',
    role: 'Gerente de Projetos',
    email: 'carlos.pereira@email.com',
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    role: 'Analista de RH',
    email: 'ana.oliveira@email.com',
  },
  {
    id: '5',
    name: 'Pedro Souza',
    role: 'Estagiário de TI',
    email: 'pedro.souza@email.com',
  },
];

const PendingUserItem = ({ item, onPress }: { item: PendingUser; onPress: () => void }) => {
  const initials = item.name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Avatar 
        source={undefined} 
        size="md"
        initials={initials} 
      />
      <View style={styles.userInfo}>
        <Text variant="body" weight="bold" style={styles.userName}>
          {item.name}
        </Text>
        <Text variant="caption" color="text.secondary" style={styles.userRole}>
          {item.role}
        </Text>
        <Text variant="caption" color="text.secondary" style={styles.userEmail}>
          {item.email}
        </Text>
      </View>
      <View style={styles.statusDot} />
    </TouchableOpacity>
  );
};

export const AdminPendingRegistrationsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <ScreenContainer scrollable={false} style={{ flex: 1 }} edges={['left', 'right']}>
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlashList
            data={PENDING_USERS}
            estimatedItemSize={90}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <PendingUserItem 
                item={item} 
                onPress={() => navigation.navigate('RegistrationDetails', {
                  userId: item.id,
                  name: item.name,
                  email: item.email,
                  role: item.role,
                })}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text variant="body" color="text.secondary">
                  Nenhum cadastro pendente.
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

