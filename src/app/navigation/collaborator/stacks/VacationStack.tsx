import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderTitle, HeaderBackButton } from '../../../../core/design-system';
import { VacationHistoryScreen } from '../../../../features/dashboard/presentation/screens/VacationHistory/VacationHistoryScreen';
import { VacationRequestDetailsScreen } from '../../../../features/dashboard/presentation/screens/VacationRequestDetails/VacationRequestDetailsScreen';

export type VacationStackParamList = {
  VacationHistory: undefined;
  VacationRequestDetails: { id: string };
};

const Stack = createNativeStackNavigator<VacationStackParamList>();

export const VacationStack = () => {
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
        name="VacationHistory" 
        component={VacationHistoryScreen} 
        options={({ navigation }) => ({
            headerTitle: () => <HeaderTitle title="Histórico de Férias" />,
            headerLeft: () => (
              <HeaderBackButton onPress={() => navigation.goBack()} />
            ),
        })}
      />
      <Stack.Screen 
        name="VacationRequestDetails" 
        component={VacationRequestDetailsScreen} 
        options={({ navigation }) => ({
            headerTitle: () => <HeaderTitle title="Detalhes da Solicitação" />,
            headerLeft: () => (
              <HeaderBackButton onPress={() => navigation.goBack()} />
            ),
        })}
      />
    </Stack.Navigator>
  );
};
