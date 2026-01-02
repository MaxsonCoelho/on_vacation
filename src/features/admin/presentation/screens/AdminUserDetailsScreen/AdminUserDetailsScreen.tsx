import React from 'react';
import { View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  ScreenContainer, 
  Text, 
  Avatar, 
  Button,
  Spacer,
  Card
} from '../../../../../core/design-system';
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
  };
};

export const AdminUserDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { name, email, role, status, createdAt } = route.params || {
    name: 'Ricardo Almeida',
    email: 'ricardo.almeida@email.com',
    role: 'Colaborador',
    status: 'Ativo',
    createdAt: '15 de março de 2023',
  };
  
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);

  const handleChangeProfile = () => {
    // TODO: Implementar alteração de perfil
    console.log('Alterar perfil:', name);
  };

  const handleDeactivateUser = () => {
    // TODO: Implementar desativação de usuário
    console.log('Desativar usuário:', name);
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
          
          <View style={styles.infoRow}>
            <Text variant="body" color="text.secondary" style={styles.infoLabel}>
              Perfil
            </Text>
            <Text variant="body" weight="bold">
              {role}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text variant="body" color="text.secondary" style={styles.infoLabel}>
              Status
            </Text>
            <Text variant="body" weight="bold">
              {status}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Text variant="body" color="text.secondary" style={styles.infoLabel}>
              Criado em
            </Text>
            <Text variant="body" weight="bold">
              {createdAt}
            </Text>
          </View>
        </Card>

        <Spacer size="lg" />

        {/* Ações */}
        <Card style={styles.actionsCard} padding="md">
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Ações
          </Text>
          
          <Spacer size="md" />
          
          <Button
            title="Alterar perfil"
            onPress={handleChangeProfile}
            variant="outline"
            style={styles.actionButton}
          />
          
          <Spacer size="md" />
          
          <Button
            title="Desativar usuário"
            onPress={handleDeactivateUser}
            variant="outline"
            style={styles.actionButton}
          />
        </Card>

        <Spacer size="xl" />
      </View>
    </ScreenContainer>
  );
};

