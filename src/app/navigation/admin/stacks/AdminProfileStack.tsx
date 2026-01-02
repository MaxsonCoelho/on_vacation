import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderTitle } from '../../../../core/design-system';
import { AdminProfileScreen } from '../../../../features/admin/presentation/screens';

export type AdminProfileStackParamList = {
  AdminProfile: undefined;
};

const Stack = createNativeStackNavigator<AdminProfileStackParamList>();

export const AdminProfileStack: React.FC = () => {
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
        name="AdminProfile" 
        component={AdminProfileScreen} 
        options={{
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Perfil" />,
        }}
      />
    </Stack.Navigator>
  );
};

