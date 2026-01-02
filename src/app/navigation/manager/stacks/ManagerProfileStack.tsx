import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderTitle } from '../../../../core/design-system';
import { ManagerProfileScreen } from '../../../../features/manager/presentation/screens/ManagerProfileScreen/ManagerProfileScreen';

export type ManagerProfileStackParamList = {
  ManagerProfile: undefined;
};

const Stack = createNativeStackNavigator<ManagerProfileStackParamList>();

export const ManagerProfileStack: React.FC = () => {
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
        name="ManagerProfile" 
        component={ManagerProfileScreen} 
        options={{
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Perfil" />,
        }}
      />
    </Stack.Navigator>
  );
};
