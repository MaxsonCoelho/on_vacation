import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminHomeScreen } from '../../../../features/admin/presentation/screens/AdminHome/AdminHomeScreen';
import { HeaderTitle, HeaderIconAction } from '../../../../core/design-system';

export type AdminHomeStackParamList = {
  AdminHome: undefined;
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
          headerLeft: () => (
            <HeaderIconAction 
              icon="menu" 
              onPress={() => {
                // Menu handler - placeholder for now
              }} 
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

