import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderTitle } from '../../../../core/design-system';
import { ProfileScreen } from '../../../../features/profile/presentation/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

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
        name="Profile" 
        component={ProfileScreen} 
        options={{
            headerTitle: () => <HeaderTitle title="Perfil" />,
        }}
      />
    </Stack.Navigator>
  );
};
