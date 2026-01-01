import React from 'react';
import { View } from 'react-native';
import { ScreenContainer, Text, Button } from '../../../../../core/design-system';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authRepository } from '../../../../auth/data/repositories/AuthRepositoryImpl';
import { logoutUseCase } from '../../../../auth/useCases/LogoutUseCase';
import { RootStackParamList } from '../../../../../app/navigation/types';
import { styles } from './styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ColaboradorHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = async () => {
    const logout = logoutUseCase(authRepository);
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'RoleSelection' }],
    });
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
