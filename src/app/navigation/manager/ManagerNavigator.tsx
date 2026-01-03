import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ManagerHomeStack } from './stacks/ManagerHomeStack';
// Import updated to use ManagerRequestsStack
import { ManagerRequestsStack } from './stacks/ManagerRequestsStack';
import { ManagerProfileStack } from './stacks/ManagerProfileStack';
import { GenericBottomTabBar, GenericTabConfig } from '../../../core/design-system/organisms/BottomTabBar/GenericBottomTabBar';
import { theme } from '../../../core/design-system/tokens';

const Tab = createBottomTabNavigator();

const tabsConfig: GenericTabConfig[] = [
  { name: 'Home', icon: 'home', label: 'Início' },
  { name: 'Requests', icon: 'file-document-outline', label: 'Solicitações' },
  { name: 'Profile', icon: 'account-outline', label: 'Perfil' },
];

export const ManagerNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <GenericBottomTabBar 
          {...props} 
          tabsConfig={tabsConfig} 
          activeColor={theme.colors.brand.manager}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={ManagerHomeStack} 
        options={{ tabBarLabel: 'Início' }}
      />
      <Tab.Screen 
        name="Requests" 
        component={ManagerRequestsStack} 
        options={{ tabBarLabel: 'Solicitações' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ManagerProfileStack} 
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};
