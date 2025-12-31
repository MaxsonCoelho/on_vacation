import React, { useState } from 'react';
import { View } from 'react-native';
import { 
  ScreenContainer, 
  Text, 
  Button, 
  Spacer 
} from '../../../../../core/design-system';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../../navigation/types';
import { styles } from './styles';
import { RFValue } from 'react-native-responsive-fontsize';

type Role = 'Colaborador' | 'Gestor' | 'Administrador';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RoleSelection'>;

export const RoleSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const roles: { label: Role; description: string }[] = [
    { 
      label: 'Colaborador', 
      description: 'Solicita e acompanha suas férias.' 
    },
    { 
      label: 'Gestor', 
      description: 'Aprova solicitações de férias.' 
    },
    { 
      label: 'Administrador', 
      description: 'Gerencia todos os aspectos do sistema.' 
    },
  ];

  return (
    <ScreenContainer scrollable>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text variant="h2" weight="bold" color="text.primary">
            Como você acessa o sistema?
          </Text>
          <Spacer size="sm" />
          <Text variant="body" color="text.secondary">
            Selecione o perfil que melhor se adapta às suas funções.
          </Text>
        </View>

        <View style={styles.roleSelectionContainer}>
          {roles.map((role) => (
            <View key={role.label} style={styles.roleButton}>
              <Button
                title={role.label}
                variant={selectedRole === role.label ? 'primary' : 'outline'}
                onPress={() => setSelectedRole(role.label)}
                fontSize={RFValue(8)}
              />
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.roleList}>
          {roles.map((role) => (
            <View key={role.label} style={styles.roleItem}>
              <Text 
                variant="body" 
                color="primary"
                weight={selectedRole === role.label ? 'bold' : 'regular'}
                style={styles.roleLabel}
              >
                {role.label}
              </Text>
              <Text variant="body" color="text.primary" style={styles.roleDescription}>
                {' '}{role.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continuar" 
          variant="primary" 
          onPress={() => {
            if (selectedRole) {
              navigation.navigate('Login', { role: selectedRole });
            }
          }}
          disabled={!selectedRole}
        />
      </View>
    </ScreenContainer>
  );
};
