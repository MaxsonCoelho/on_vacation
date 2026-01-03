import React from 'react';
import { View } from 'react-native';
import { SafeArea } from '../../atoms';
import { TabItem } from '../../molecules';
import { BottomTabBarProps } from './types';
import { styles } from './styles';

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  tabs,
  activeKey,
  onTabPress,
  style,
  activeColor,
}) => {
  return (
    <SafeArea edges={['bottom']} style={styles.safeArea}>
      <View style={[styles.container, style]}>
        {tabs.map((tab) => (
          <TabItem
            key={tab.key}
            label={tab.label}
            icon={tab.icon}
            active={activeKey === tab.key}
            onPress={() => onTabPress(tab.key)}
            activeColor={activeColor}
          />
        ))}
      </View>
    </SafeArea>
  );
};
