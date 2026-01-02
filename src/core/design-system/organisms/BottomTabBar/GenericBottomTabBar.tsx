import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BottomTabBar as DesignSystemBottomTabBar } from './BottomTabBar';
import { IconName } from '../../atoms/Icon/types';

export interface GenericTabConfig {
  name: string;
  icon: IconName;
  label?: string;
}

interface GenericBottomTabBarProps extends BottomTabBarProps {
  tabsConfig: GenericTabConfig[];
}

export const GenericBottomTabBar: React.FC<GenericBottomTabBarProps> = (props) => {
  const { state, descriptors, navigation, tabsConfig } = props;

  const tabs = state.routes.map((route) => {
    const { options } = descriptors[route.key];
    const config = tabsConfig.find(t => t.name === route.name);
    
    // Fallback icon if not configured
    const icon: IconName = config?.icon || 'help-circle-outline';
    
    return {
      key: route.key,
      label: (options.tabBarLabel as string) || options.title || config?.label || route.name,
      icon,
    };
  });

  return (
    <DesignSystemBottomTabBar
      tabs={tabs}
      activeKey={state.routes[state.index].key}
      onTabPress={(key) => {
        const route = state.routes.find(r => r.key === key);
        if (route) {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }
      }}
    />
  );
};
