import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminHomeStack } from './stacks/AdminHomeStack';
import { AdminUsersStack } from './stacks/AdminUsersStack';
import { AdminReportsStack } from './stacks/AdminReportsStack';
import { AdminProfileStack } from './stacks/AdminProfileStack';
import { GenericBottomTabBar, GenericTabConfig } from '../../../core/design-system/organisms/BottomTabBar/GenericBottomTabBar';

const Tab = createBottomTabNavigator();

const tabsConfig: GenericTabConfig[] = [
  { name: 'Home', icon: 'home', label: 'Início' },
  { name: 'Users', icon: 'account-multiple', label: 'Usuários' },
  { name: 'Reports', icon: 'chart-line', label: 'Relatórios' },
  { name: 'Profile', icon: 'account-outline', label: 'Perfil' },
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
        component={AdminUsersStack} 
        options={{ tabBarLabel: 'Usuários' }}
      />
      <Tab.Screen 
        name="Reports" 
        component={AdminReportsStack} 
        options={{ tabBarLabel: 'Relatórios' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={AdminProfileStack} 
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

