import React from 'react';
import { View } from 'react-native';
import { ScreenContainer, Text, Button, Spacer } from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { styles } from './styles';

export const SettingsScreen = () => {
  const { signOut } = useAuthStore();

  return (
    <ScreenContainer edges={['left', 'right']}>
      <View style={styles.container}>
        <Text variant="h3">Configurações</Text>
        <Spacer size="xl" />
        <Button title="Sair" onPress={signOut} variant="outline" />
      </View>
    </ScreenContainer>
  );
};

