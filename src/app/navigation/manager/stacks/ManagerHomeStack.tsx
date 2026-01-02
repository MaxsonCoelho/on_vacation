import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ManagerHomeScreen } from '../../../../features/manager/presentation/screens';
import { HeaderTitle, HeaderIconAction, HeaderBackButton } from '../../../../core/design-system';

// Por enquanto vamos reutilizar a SettingsScreen do colaborador ou criar uma específica para o manager futuramente
// Vamos usar placeholder por enquanto para não quebrar
import { View } from 'react-native';
const PlaceholderScreen = () => <View />;

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
        component={PlaceholderScreen} 
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
