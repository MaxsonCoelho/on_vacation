import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderTitle } from '../../../../core/design-system';
import { AdminReportsScreen } from '../../../../features/admin/presentation/screens';

export type AdminReportsStackParamList = {
  AdminReports: undefined;
};

const Stack = createNativeStackNavigator<AdminReportsStackParamList>();

export const AdminReportsStack: React.FC = () => {
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
        name="AdminReports" 
        component={AdminReportsScreen} 
        options={{
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Relatórios" />,
        }}
      />
    </Stack.Navigator>
  );
};

