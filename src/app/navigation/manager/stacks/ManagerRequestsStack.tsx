import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderTitle } from '../../../../core/design-system';
import { ManagerRequestsScreen } from '../../../../features/manager/presentation/screens/ManagerRequestsScreen/ManagerRequestsScreen';

export type ManagerRequestsStackParamList = {
  ManagerRequests: undefined;
};

const Stack = createNativeStackNavigator<ManagerRequestsStackParamList>();

export const ManagerRequestsStack: React.FC = () => {
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
        name="ManagerRequests" 
        component={ManagerRequestsScreen} 
        options={{
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Solicitações" />,
        }}
      />
    </Stack.Navigator>
  );
};
