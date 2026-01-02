import React from 'react';
import { View, ScrollView } from 'react-native';
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
import { AdminHomeStackParamList } from '../../../../../app/navigation/admin/stacks/AdminHomeStack';

type NavigationProp = NativeStackNavigationProp<AdminHomeStackParamList>;
type RouteProp = {
  params: {
    userId: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    position?: string;
    phone?: string;
    registrationDate?: string;
  };
};

// Dados estáticos para demonstração
const USER_DETAILS: Record<string, any> = {
  '1': {
    name: 'Lucas Oliveira',
    email: 'lucas.oliveira@email.com',
    requestedRole: 'Colaborador',
    registrationDate: '15/07/2024',
    department: 'Marketing',
    position: 'Analista de Marketing',
    phone: '(11) 99999-8888',
    status: 'Pendente de aprovação',
  },
  '2': {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    requestedRole: 'Colaborador',
    registrationDate: '15/07/2024',
    department: 'Marketing',
    position: 'Analista de Marketing',
    phone: '(11) 99999-8888',
    status: 'Pendente de aprovação',
  },
  '3': {
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    requestedRole: 'Colaborador',
    registrationDate: '15/07/2024',
    department: 'TI',
    position: 'Desenvolvedora Front-end',
    phone: '(11) 99999-8888',
    status: 'Pendente de aprovação',
  },
  '4': {
    name: 'Carlos Pereira',
    email: 'carlos.pereira@email.com',
    requestedRole: 'Colaborador',
    registrationDate: '15/07/2024',
    department: 'Projetos',
    position: 'Gerente de Projetos',
    phone: '(11) 99999-8888',
    status: 'Pendente de aprovação',
  },
  '5': {
    name: 'Pedro Souza',
    email: 'pedro.souza@email.com',
    requestedRole: 'Colaborador',
    registrationDate: '15/07/2024',
    department: 'TI',
    position: 'Estagiário de TI',
    phone: '(11) 99999-8888',
    status: 'Pendente de aprovação',
  },
};

export const AdminRegistrationDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { userId } = route.params || { userId: '1' };
  
  const user = USER_DETAILS[userId] || USER_DETAILS['1'];
  const initials = user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2);

  const handleApprove = () => {
    // TODO: Implementar aprovação
    console.log('Aprovar cadastro:', userId);
  };

  const handleReject = () => {
    // TODO: Implementar rejeição
    console.log('Rejeitar cadastro:', userId);
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
            {user.name}
          </Text>
          <Spacer size="xs" />
          <Text variant="body" color="text.secondary" style={styles.email}>
            {user.email}
          </Text>
          <Spacer size="sm" />
          <Text variant="body" color="text.secondary" style={styles.registrationInfo}>
            Perfil solicitado: {user.requestedRole} • Data de cadastro: {user.registrationDate}
          </Text>
        </Card>

        <Spacer size="lg" />

        {/* Informações adicionais */}
        <Card style={styles.infoCard} padding="md">
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Informações adicionais
          </Text>
          <View style={styles.separator} />
          
          <View style={styles.infoRow}>
            <Text variant="body" color="text.secondary" style={styles.infoLabel}>
              Departamento
            </Text>
            <Text variant="body" weight="bold">
              {user.department}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body" color="text.secondary" style={styles.infoLabel}>
              Cargo
            </Text>
            <Text variant="body" weight="bold">
              {user.position}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body" color="text.secondary" style={styles.infoLabel}>
              Telefone
            </Text>
            <Text variant="body" weight="bold">
              {user.phone}
            </Text>
          </View>
        </Card>

        <Spacer size="lg" />

        {/* Status do cadastro */}
        <Card style={styles.statusCard} padding="md">
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Status do cadastro
          </Text>
          <View style={styles.separator} />
          <Text variant="body" style={styles.statusText}>
            {user.status}
          </Text>
        </Card>

        <Spacer size="xl" />

        {/* Botões de ação */}
        <View style={styles.actionsContainer}>
          <Button
            title="Rejeitar"
            onPress={handleReject}
            variant="outline"
            style={styles.rejectButton}
          />
          <Spacer size="md" horizontal />
          <Button
            title="Aprovar cadastro"
            onPress={handleApprove}
            variant="primary"
            style={styles.approveButton}
          />
        </View>

        <Spacer size="lg" />
      </View>
    </ScreenContainer>
  );
};

