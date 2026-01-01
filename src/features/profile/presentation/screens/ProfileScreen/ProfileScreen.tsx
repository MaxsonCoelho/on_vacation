import React from 'react';
import { View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { 
  ScreenContainer, 
  ProfileHeader, 
  Text, 
  Spacer,
  ListSection
} from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { styles } from './styles';

export const ProfileScreen = () => {
  const { user } = useAuthStore();

  const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => {
    const isName = label === 'Nome';
    
    return (
      <View style={styles.infoRow}>
        <Text variant="body" color="text.secondary" style={styles.infoLabel}>
          {label}
        </Text>
        <Text 
          variant="body" 
          color="text.primary" 
          weight="bold" 
          style={[
            styles.infoValue,
            !isName && { fontSize: RFValue(12) }
          ]}
        >
          {value || '-'}
        </Text>
      </View>
    );
  };

  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <View style={styles.container}>
        <ProfileHeader
          name={user?.name || 'Usuário'}
          role={user?.role || 'Colaborador'}
          avatarUrl={user?.avatar}
        />

        <Spacer size="lg" />

        <ListSection title="Dados Pessoais">
          <InfoRow label="Nome" value={user?.name} />
          <InfoRow label="E-mail" value={user?.email} />
          <InfoRow label="Cargo" value={user?.role} />
          {/* Adicionar mais campos conforme existam na tabela profile */}
          <InfoRow label="Setor" value="Tecnologia" /> 
          <InfoRow label="Admissão" value="01/01/2023" />
        </ListSection>

        <Spacer size="md" />

        <ListSection title="Informações de Férias">
          <InfoRow label="Saldo Atual" value="15 dias" />
          <InfoRow label="Período Aquis." value="01/01/2023 - 01/01/2024" />
        </ListSection>
      </View>
    </ScreenContainer>
  );
};
