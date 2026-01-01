import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderTitle } from '../../../../core/design-system';

const PlaceholderScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Minhas Férias (Em Breve)</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export const VacationStack = () => {
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
        name="VacationList" 
        component={PlaceholderScreen} 
        options={{
            headerTitle: () => <HeaderTitle title="Minhas Férias" />,
        }}
      />
    </Stack.Navigator>
  );
};
