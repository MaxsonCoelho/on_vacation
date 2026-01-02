import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { 
  ScreenContainer, 
  Text, 
  Card, 
  Spacer 
} from '../../../../../core/design-system';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';

export const AdminHomeScreen = () => {
  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <View style={styles.container}>
        {/* Métricas */}
        <View style={styles.metricsRow}>
          <Card style={styles.metricCard} padding="md">
            <Text variant="body" color="text.secondary" style={styles.metricLabel}>
              Cadastros pendentes
            </Text>
            <Text variant="h1" weight="bold" style={styles.metricValue}>
              3
            </Text>
          </Card>
          
          <Card style={styles.metricCard} padding="md">
            <Text variant="body" color="text.secondary" style={styles.metricLabel}>
              Total de colaboradores ativos
            </Text>
            <Text variant="h1" weight="bold" style={styles.metricValue}>
              125
            </Text>
          </Card>
        </View>

        <Card style={styles.metricCardFull} padding="md">
          <Text variant="body" color="text.secondary" style={styles.metricLabel}>
            Total de gestores
          </Text>
          <Text variant="h1" weight="bold" style={styles.metricValue}>
            15
          </Text>
        </Card>

        <Spacer size="xl" />

        {/* Ações Rápidas */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Ações rápidas
        </Text>

        <TouchableOpacity activeOpacity={0.7}>
          <Card style={styles.actionCard} padding="md">
            <View style={styles.actionContent}>
              <View style={styles.actionTextContainer}>
                <Text variant="h3" weight="bold" style={styles.actionTitle}>
                  Aprovar novos colaboradores
                </Text>
                <Text variant="body" weight="bold" style={styles.actionSubtitle}>
                  Novos membros
                </Text>
                <Spacer size="xs" />
                <Text variant="body" color="text.secondary">
                  Revise e aprove as solicitações de novos colaboradores.
                </Text>
              </View>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=150&fit=crop' }}
                style={styles.actionImage}
                resizeMode="cover"
              />
            </View>
          </Card>
        </TouchableOpacity>

        <Spacer size="md" />

        <TouchableOpacity activeOpacity={0.7}>
          <Card style={styles.actionCard} padding="md">
            <View style={styles.actionContent}>
              <View style={styles.actionTextContainer}>
                <Text variant="h3" weight="bold" style={styles.actionTitle}>
                  Visualizar usuários
                </Text>
                <Text variant="body" weight="bold" style={styles.actionSubtitle}>
                  Gerenciar usuários
                </Text>
                <Spacer size="xs" />
                <Text variant="body" color="text.secondary">
                  Consulte a lista completa de usuários e suas informações.
                </Text>
              </View>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=150&fit=crop' }}
                style={styles.actionImage}
                resizeMode="cover"
              />
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};
