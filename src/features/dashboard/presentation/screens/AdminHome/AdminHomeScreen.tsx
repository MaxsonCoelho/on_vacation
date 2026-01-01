import React from 'react';
import { View } from 'react-native';
import { ScreenContainer, Text, Button } from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { styles } from './styles';

export const AdminHomeScreen = () => {
  const { signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScreenContainer edges={['left', 'right']}>
      <View style={styles.container}>
        <Text variant="h2">Painel do Administrador</Text>
        <Text variant="body" style={styles.description}>
          Bem-vindo, Administrador! Aqui você poderá gerenciar usuários e configurações do sistema.
        </Text>
        <Button title="Sair" onPress={handleLogout} variant="outline" />
      </View>
    </ScreenContainer>
  );
};

