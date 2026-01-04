import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../../features/auth/presentation/store/useAuthStore';
import { 
  RoleSelectionScreen, 
  LoginScreen, 
  RegisterScreen,
  ForgotPasswordScreen 
} from '../../features/auth/presentation/screens';
import { ManagerNavigator } from './manager/ManagerNavigator';
import { AdminNavigator } from './admin/AdminNavigator';
import { CollaboratorNavigator } from './collaborator/CollaboratorNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, isInitialized, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          headerShown: false,
        }}
      >
        {user ? (
          <>
            {user.role === 'Gestor' && (
              <Stack.Screen 
                name="ManagerHome" 
                component={ManagerNavigator} 
              />
            )}
            {user.role === 'Administrador' && (
              <Stack.Screen 
                name="AdminHome" 
                component={AdminNavigator} 
                options={{ headerShown: false }}
              />
            )}
            {user.role === 'Colaborador' && (
              <Stack.Screen 
                name="CollaboratorHome" 
                component={CollaboratorNavigator} 
                options={{ headerShown: false }}
              />
            )}
          </>
        ) : (
          <>
            <Stack.Screen 
              name="RoleSelection" 
              component={RoleSelectionScreen} 
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
