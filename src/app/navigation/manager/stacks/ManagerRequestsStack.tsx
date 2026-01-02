import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderTitle } from '../../../../core/design-system';
import { ManagerRequestsScreen } from '../../../../features/manager/presentation/screens/ManagerRequestsScreen/ManagerRequestsScreen';
import { RequestAnalysisScreen } from '../../../../features/manager/presentation/screens/RequestAnalysisScreen/RequestAnalysisScreen';

export type ManagerRequestsStackParamList = {
  ManagerRequests: undefined;
  RequestAnalysis: { id: string };
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
      <Stack.Screen 
        name="RequestAnalysis" 
        component={RequestAnalysisScreen} 
        options={{
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Análise de Solicitação" />,
          presentation: 'card', // Or 'modal' depending on preference, standard stack is fine too
        }}
      />
    </Stack.Navigator>
  );
};
