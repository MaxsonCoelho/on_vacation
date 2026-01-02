import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  CollaboratorHomeScreen, 
  RequestVacationScreen, 
  SettingsScreen 
} from '../../../../features/collaborator/presentation/screens';
import { HeaderTitle, HeaderIconAction, HeaderBackButton } from '../../../../core/design-system';

export type HomeStackParamList = {
  CollaboratorHome: undefined;
  RequestVacation: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack: React.FC = () => {
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
        name="CollaboratorHome" 
        component={CollaboratorHomeScreen} 
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
        name="RequestVacation" 
        component={RequestVacationScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <HeaderTitle title="Solicitar férias" />,
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigation.goBack()} />
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
