import React from 'react';
import { View } from 'react-native';
import { ScreenContainer, Text, Button } from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { styles } from './styles';

export const ManagerHomeScreen = () => {
  const { signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text variant="h2">Painel do Gestor</Text>
        <Text variant="body" style={styles.description}>
          Bem-vindo, Gestor! Aqui você poderá aprovar férias e gerenciar sua equipe.
        </Text>
        <Button title="Sair" onPress={handleLogout} variant="outline" />
      </View>
    </ScreenContainer>
  );
};

