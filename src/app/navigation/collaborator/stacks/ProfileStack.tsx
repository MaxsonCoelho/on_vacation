import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderTitle } from '../../../../core/design-system';
import { ProfileScreen } from '../../../../features/collaborator/presentation/screens';

export type ProfileStackParamList = {
  CollaboratorProfile: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => {
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
        name="CollaboratorProfile" 
        component={ProfileScreen} 
        options={{
            headerTitle: () => <HeaderTitle title="Perfil" />,
        }}
      />
    </Stack.Navigator>
  );
};
