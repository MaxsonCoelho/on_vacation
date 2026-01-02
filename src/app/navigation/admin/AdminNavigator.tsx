import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminHomeStack } from './stacks/AdminHomeStack';
import { GenericBottomTabBar, GenericTabConfig } from '../../../core/design-system/organisms/BottomTabBar/GenericBottomTabBar';

const Tab = createBottomTabNavigator();

const tabsConfig: GenericTabConfig[] = [
  { name: 'Home', icon: 'home', label: 'Início' },
  { name: 'Users', icon: 'account-multiple', label: 'Usuários' },
  { name: 'Reports', icon: 'chart-line', label: 'Relatórios' },
  { name: 'Settings', icon: 'cog-outline', label: 'Configurações' },
];

export const AdminNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <GenericBottomTabBar {...props} tabsConfig={tabsConfig} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={AdminHomeStack} 
        options={{ tabBarLabel: 'Início' }}
      />
      <Tab.Screen 
        name="Users" 
        component={AdminHomeStack} 
        options={{ tabBarLabel: 'Usuários' }}
      />
      <Tab.Screen 
        name="Reports" 
        component={AdminHomeStack} 
        options={{ tabBarLabel: 'Relatórios' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={AdminHomeStack} 
        options={{ tabBarLabel: 'Configurações' }}
      />
    </Tab.Navigator>
  );
};

