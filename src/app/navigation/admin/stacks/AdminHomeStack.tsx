import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminHomeScreen, SettingsScreen, AdminPendingRegistrationsScreen, AdminRegistrationDetailsScreen } from '../../../../features/admin/presentation/screens';
import { HeaderTitle, HeaderIconAction, HeaderBackButton } from '../../../../core/design-system';

export type AdminHomeStackParamList = {
  AdminHome: undefined;
  Settings: undefined;
  PendingRegistrations: undefined;
  RegistrationDetails: {
    userId: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    position?: string;
    phone?: string;
    registrationDate?: string;
  };
};

const Stack = createNativeStackNavigator<AdminHomeStackParamList>();

export const AdminHomeStack: React.FC = () => {
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
        name="AdminHome" 
        component={AdminHomeScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Administração" />,
          headerRight: () => (
            <HeaderIconAction 
              icon="cog-outline" 
              onPress={() => navigation.navigate('Settings')} 
            />
          ),
        })}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Configurações" />,
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen 
        name="PendingRegistrations" 
        component={AdminPendingRegistrationsScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Cadastros pendentes" />,
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen 
        name="RegistrationDetails" 
        component={AdminRegistrationDetailsScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Detalhes do cadastro" />,
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

