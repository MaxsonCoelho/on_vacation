import React from 'react';
import { View } from 'react-native';
import { 
  ScreenContainer, 
  Text, 
  Card, 
  Spacer 
} from '../../../../../core/design-system';
import { styles } from './styles';

export const AdminReportsScreen = () => {
  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <View style={styles.container}>
        {/* Métricas Gerais */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Visão Geral
        </Text>

        <View style={styles.metricsRow}>
          <Card style={styles.metricCard} padding="md">
            <Text variant="body" color="text.secondary" style={styles.metricLabel}>
              Total de Solicitações
            </Text>
            <Text variant="h1" weight="bold" style={styles.metricValue}>
              342
            </Text>
          </Card>
          
          <Card style={styles.metricCard} padding="md">
            <Text variant="body" color="text.secondary" style={styles.metricLabel}>
              Solicitações Aprovadas
            </Text>
            <Text variant="h1" weight="bold" style={[styles.metricValue, styles.approvedValue]}>
              285
            </Text>
          </Card>
        </View>

        <View style={styles.metricsRow}>
          <Card style={styles.metricCard} padding="md">
            <Text variant="body" color="text.secondary" style={styles.metricLabel}>
              Solicitações Pendentes
            </Text>
            <Text variant="h1" weight="bold" style={[styles.metricValue, styles.pendingValue]}>
              42
            </Text>
          </Card>
          
          <Card style={styles.metricCard} padding="md">
            <Text variant="body" color="text.secondary" style={styles.metricLabel}>
              Solicitações Reprovadas
            </Text>
            <Text variant="h1" weight="bold" style={[styles.metricValue, styles.rejectedValue]}>
              15
            </Text>
          </Card>
        </View>

        <Spacer size="xl" />

        {/* Estatísticas de Usuários */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Usuários do Sistema
        </Text>

        <Card style={styles.fullCard} padding="md">
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Total de Colaboradores</Text>
            <Text variant="title" weight="bold">125</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Total de Gestores</Text>
            <Text variant="title" weight="bold">15</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Colaboradores Ativos</Text>
            <Text variant="title" weight="bold">120</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Cadastros Pendentes</Text>
            <Text variant="title" weight="bold">5</Text>
          </View>
        </Card>

        <Spacer size="xl" />

        {/* Estatísticas do Mês */}
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Este Mês
        </Text>

        <Card style={styles.fullCard} padding="md">
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Novas Solicitações</Text>
            <Text variant="title" weight="bold">28</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Solicitações Aprovadas</Text>
            <Text variant="title" weight="bold">22</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text variant="body" color="text.secondary">Novos Cadastros</Text>
            <Text variant="title" weight="bold">8</Text>
          </View>
        </Card>

        <Spacer size="xl" />
      </View>
    </ScreenContainer>
  );
};

