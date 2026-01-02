import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderTitle, HeaderBackButton } from '../../../../core/design-system';
import { AdminUsersScreen, AdminUserDetailsScreen } from '../../../../features/admin/presentation/screens';

export type AdminUsersStackParamList = {
  AdminUsers: undefined;
  UserDetails: {
    userId: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  };
};

const Stack = createNativeStackNavigator<AdminUsersStackParamList>();

export const AdminUsersStack: React.FC = () => {
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
        name="AdminUsers" 
        component={AdminUsersScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Usuários" />,
        })}
      />
      <Stack.Screen 
        name="UserDetails" 
        component={AdminUserDetailsScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Detalhes do Usuário" />,
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

