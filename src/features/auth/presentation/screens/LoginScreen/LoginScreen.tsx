import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ScreenContainer, 
  Text, 
  Button, 
  Spacer,
  FeedbackBottomSheet,
  ControlledFormField
} from '../../../../../core/design-system';
import { styles } from './styles';
import { LoginScreenProps } from './types';
import { theme } from '../../../../../core/design-system/tokens';
import { useLoginViewModel } from '../../viewModel';
import { loginSchema, LoginFormData } from '../../../domain/schemas/loginSchema';

export const LoginScreen: React.FC<LoginScreenProps> = ({ route, navigation }) => {
  const { role } = route.params;
  const {
    isLoading,
    feedback,
    closeFeedback,
    handleLogin,
  } = useLoginViewModel();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    handleLogin(role, data.email, data.password);
  };

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
          <ControlledFormField
            control={control}
            name="email"
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <ControlledFormField
            control={control}
            name="password"
            placeholder="Senha"
            secureTextEntry={!isPasswordVisible}
            rightIcon={isPasswordVisible ? 'eye-off' : 'eye'}
            onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />

          <Spacer size="md" />

          <Button
            title={isLoading ? "Carregando..." : "Entrar"}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
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

          <Spacer size="lg" />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text variant="caption" color="text.secondary" style={styles.dividerText}>
              ou
            </Text>
            <View style={styles.divider} />
          </View>

          <Spacer size="md" />

          <Button
            title="Criar meu cadastro"
            onPress={() => navigation.navigate('Register', { role })}
            variant="outline"
          />
        </View>
      </View>

      <FeedbackBottomSheet
        visible={feedback.visible}
        title={feedback.title}
        description={feedback.description}
        type={feedback.type}
        primaryAction={feedback.primaryAction}
        secondaryAction={feedback.secondaryAction}
        onClose={closeFeedback}
      />
    </ScreenContainer>
  );
};
