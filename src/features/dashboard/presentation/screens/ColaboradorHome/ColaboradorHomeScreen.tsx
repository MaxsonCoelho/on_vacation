import React from 'react';
import { View } from 'react-native';
import { ScreenContainer, Text, Button } from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { styles } from './styles';

export const ColaboradorHomeScreen = () => {
  const { signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text variant="h2">Painel do Colaborador</Text>
        <Text variant="body" style={styles.description}>
          Bem-vindo, Colaborador! Aqui você poderá solicitar e acompanhar suas férias.
        </Text>
        <Button title="Sair" onPress={handleLogout} variant="outline" />
      </View>
    </ScreenContainer>
  );
};

