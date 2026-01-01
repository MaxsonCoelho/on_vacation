import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { CollaboratorHomeScreen } from '../../../../features/dashboard/presentation/screens/CollaboratorHome/CollaboratorHomeScreen';
import { RequestVacationScreen } from '../../../../features/dashboard/presentation/screens/RequestVacation/RequestVacationScreen';
import { HeaderTitle, HeaderIconAction, HeaderBackButton } from '../../../../core/design-system';
import { useAuthStore } from '../../../../features/auth/presentation/store/useAuthStore';

export type HomeStackParamList = {
  CollaboratorHome: undefined;
  RequestVacation: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack: React.FC = () => {
  const { signOut } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Configurações',
      'O que você deseja fazer?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive', 
          onPress: signOut 
        }
      ]
    );
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="CollaboratorHome" 
        component={CollaboratorHomeScreen} 
        options={{
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Início" />,
          headerRight: () => (
            <HeaderIconAction 
              icon="cog-outline" 
              onPress={handleLogout} 
            />
          ),
        }}
      />
      <Stack.Screen 
        name="RequestVacation" 
        component={RequestVacationScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Solicitar férias" />,
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
