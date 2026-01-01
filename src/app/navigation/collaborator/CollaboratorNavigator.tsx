import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { HomeStack } from './stacks/HomeStack';
import { VacationStack } from './stacks/VacationStack';
import { ProfileStack } from './stacks/ProfileStack';
import { BottomTabBar } from '../../../core/design-system';
import { IconName } from '../../../core/design-system/atoms/Icon/types';

const Tab = createBottomTabNavigator();

export const CollaboratorNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props: BottomTabBarProps) => {
        const tabs = props.state.routes.map((route) => {
          const { options } = props.descriptors[route.key];
          
          let icon: IconName = 'help-circle-outline';
          if (route.name === 'Home') icon = 'home';
          if (route.name === 'Vacation') icon = 'calendar-blank';
          if (route.name === 'Profile') icon = 'account-outline';
          
          return {
            key: route.key,
            label: (options.tabBarLabel as string) || options.title || route.name,
            icon,
          };
        });

        return (
          <BottomTabBar
            tabs={tabs}
            activeKey={props.state.routes[props.state.index].key}
            onTabPress={(key) => {
              const route = props.state.routes.find(r => r.key === key);
              if (route) {
                const event = props.navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!event.defaultPrevented) {
                  props.navigation.navigate(route.name);
                }
              }
            }}
          />
        );
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{
          tabBarLabel: 'Início',
        }}
      />
      <Tab.Screen 
        name="Vacation" 
        component={VacationStack} 
        options={{
          tabBarLabel: 'Minhas Férias',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack} 
        options={{
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};
