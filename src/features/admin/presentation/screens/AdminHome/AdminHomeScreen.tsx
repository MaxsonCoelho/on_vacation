import React from 'react';
import { View } from 'react-native';
import { ScreenContainer, Text, Button } from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { styles } from './styles';

export const AdminHomeScreen = () => {
  const { signOut } = useAuthStore();

  return (
    <ScreenContainer edges={['left', 'right']}>
      <View style={styles.container}>
        <Text variant="h2">Painel do Administrador</Text>
        <Button title="Sair" onPress={signOut} variant="outline" />
      </View>
    </ScreenContainer>
  );
};
