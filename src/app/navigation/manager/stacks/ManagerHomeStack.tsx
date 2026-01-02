import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ManagerHomeScreen, SettingsScreen } from '../../../../features/manager/presentation/screens';
import { HeaderTitle, HeaderIconAction, HeaderBackButton } from '../../../../core/design-system';

export type ManagerHomeStackParamList = {
  ManagerHome: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<ManagerHomeStackParamList>();

export const ManagerHomeStack: React.FC = () => {
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
        name="ManagerHome" 
        component={ManagerHomeScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Início" />,
          headerRight: () => (
            <HeaderIconAction 
              icon="cog-outline" 
              onPress={() => navigation.navigate('Settings')} 
            />
          ),
        })}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Configurações" />,
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
