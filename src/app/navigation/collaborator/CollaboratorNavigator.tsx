import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from './stacks/HomeStack';
import { VacationStack } from './stacks/VacationStack';
import { ProfileStack } from './stacks/ProfileStack';
import { GenericBottomTabBar, GenericTabConfig } from '../../../core/design-system/organisms/BottomTabBar/GenericBottomTabBar';
import { theme } from '../../../core/design-system/tokens';

const Tab = createBottomTabNavigator();

const tabsConfig: GenericTabConfig[] = [
  { name: 'Home', icon: 'home', label: 'Início' },
  { name: 'Vacation', icon: 'calendar-blank', label: 'Minhas Férias' },
  { name: 'Profile', icon: 'account-outline', label: 'Perfil' },
];

export const CollaboratorNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <GenericBottomTabBar 
          {...props} 
          tabsConfig={tabsConfig} 
          activeColor={theme.colors.brand.collaborator}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ tabBarLabel: 'Início' }}
      />
      <Tab.Screen 
        name="Vacation" 
        component={VacationStack} 
        options={{ tabBarLabel: 'Minhas Férias' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack} 
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};
