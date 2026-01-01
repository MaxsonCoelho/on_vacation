import React from 'react';
import { View } from 'react-native';
import { 
  ScreenContainer, 
  Text, 
  Button, 
  Card, 
  Icon, 
  Spacer 
} from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../../../app/navigation/collaborator/stacks/HomeStack';

const recentRequests = [
  { 
    id: '1', 
    title: 'Férias de Verão', 
    date: '20/07/2024 - 30/07/2024', 
    status: 'success' as const 
  },
  { 
    id: '2', 
    title: 'Férias de Inverno', 
    date: '15/01/2024 - 25/01/2024', 
    status: 'success' as const 
  },
  { 
    id: '3', 
    title: 'Férias de Primavera', 
    date: '05/05/2023 - 15/05/2023', 
    status: 'success' as const 
  },
];

export const CollaboratorHomeScreen = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const getFirstName = (fullName?: string) => {
    return fullName?.split(' ')[0] || 'Colaborador';
  };

  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <View style={styles.container}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text variant="h1" weight="bold">
            Olá, {getFirstName(user?.name)}
          </Text>
        </View>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <Text variant="h3" weight="bold" color="text.primary">
              Solicitações de Férias
            </Text>
            <Spacer size="xs" />
            <Text variant="body" color="primary">
              Total: 5 | Pendentes: 2
            </Text>
          </View>
          <View style={styles.summaryIconContainer}>
            <Icon name="calendar-check" size={32} color="secondary" />
          </View>
        </Card>

        {/* Action Button */}
        <View style={styles.actionButton}>
          <Button 
            title="Solicitar férias" 
            variant="primary" 
            onPress={() => navigation.navigate('RequestVacation')} 
          />
        </View>

        {/* Recent Requests */}
        <View>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Solicitações recentes
          </Text>
          
          {recentRequests.map((item) => (
            <Card key={item.id} style={styles.requestItem} padding="sm">
              <View style={styles.requestIconContainer}>
                <Icon name="calendar-blank" size={24} color="text.secondary" />
              </View>
              <View style={styles.requestContent}>
                <Text variant="body" weight="bold">{item.title}</Text>
                <Text variant="caption" color="text.secondary">{item.date}</Text>
              </View>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: theme.colors.status[item.status] }
                ]} 
              />
            </Card>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
};

