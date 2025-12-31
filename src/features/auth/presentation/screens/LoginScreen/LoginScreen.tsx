import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { 
  ScreenContainer, 
  Text, 
  Input, 
  Button, 
  Spacer
} from '../../../../../core/design-system';
import { styles } from './styles';
import { LoginScreenProps } from './types';
import { theme } from '../../../../../core/design-system/tokens';

export const LoginScreen: React.FC<LoginScreenProps> = ({ route, navigation }) => {
  const { role } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Determine button styles based on role
  const getButtonProps = () => {
    switch (role) {
      case 'Gestor':
        return {
          style: { backgroundColor: '#39FF14' }, // Neon Green
          textStyle: { color: theme.colors.text.primary }, // Dark text for contrast
          variant: 'primary' as const, // Base variant, overridden by style
        };
      case 'Administrador':
        return {
          style: { 
            backgroundColor: '#FFFFFF',
            borderColor: theme.colors.primary,
            borderWidth: 1,
          },
          textStyle: { color: theme.colors.primary },
          variant: 'outline' as const,
        };
      case 'Colaborador':
      default:
        return {
          variant: 'primary' as const,
        };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <ScreenContainer scrollable>
      <View style={styles.content}>
        <Text variant="h2" weight="bold" style={styles.title}>
          Login – {role}
        </Text>

        <View style={styles.subtitleContainer}>
          <Text variant="body" color="text.secondary">
            Perfil selecionado: {role} |{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text variant="body" color="text.link" style={styles.changeRoleLink}>
              Alterar
            </Text>
          </TouchableOpacity>
        </View>

        <Text variant="body" color="text.primary" style={styles.description}>
          Por favor, insira suas credenciais para acessar o sistema.
        </Text>

        <View style={styles.form}>
          <Input
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Spacer size="md" />

          <Button
            title="Entrar"
            onPress={() => console.log('Login attempt', { role, email })}
            {...buttonProps}
          />

          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={() => navigation.navigate('ForgotPassword', { role })}
          >
            <Text variant="body" color="text.link" style={styles.forgotPasswordText}>
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
};
