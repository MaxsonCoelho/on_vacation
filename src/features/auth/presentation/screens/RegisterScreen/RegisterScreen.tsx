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
  ControlledFormField,
  Alert
} from '../../../../../core/design-system';
import { styles } from './styles';
import { RegisterScreenProps } from './types';
import { theme } from '../../../../../core/design-system/tokens';
import { useRegisterViewModel } from '../../viewModel';
import { registerSchema, RegisterFormData } from '../../../domain/schemas/registerSchema';
import { phoneMask } from '../../../../../core/utils/masks';

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ route, navigation }) => {
  const { role } = route.params;
  const {
    isLoading,
    feedback,
    closeFeedback,
    handleRegister,
  } = useRegisterViewModel();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: '',
      position: '',
      phone: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    handleRegister(
      role, 
      data.email, 
      data.password, 
      data.name,
      data.department,
      data.position,
      data.phone
    );
  };

  // Determine button styles based on role
  const getButtonProps = () => {
    switch (role) {
      case 'Gestor':
        return {
          style: { backgroundColor: '#39FF14' },
          textStyle: { color: theme.colors.text.primary },
          variant: 'primary' as const,
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
          Criar Cadastro – {role}
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
          Preencha os dados abaixo para criar seu cadastro no sistema.
        </Text>

        <View style={styles.approvalNotice}>
          <Alert
            variant="info"
            message="Seu cadastro será revisado por um administrador antes de ser aprovado. Você receberá uma notificação quando puder fazer login."
          />
        </View>

        <View style={styles.form}>
          <ControlledFormField
            control={control}
            name="name"
            placeholder="Nome completo"
            autoCapitalize="words"
          />
          
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

          <ControlledFormField
            control={control}
            name="confirmPassword"
            placeholder="Confirmar senha"
            secureTextEntry={!isConfirmPasswordVisible}
            rightIcon={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
            onRightIconPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          />

          <Spacer size="lg" />

          <Text variant="h3" weight="semibold" style={styles.sectionTitle}>
            Informações adicionais
          </Text>
          <Text variant="caption" color="text.secondary" style={styles.sectionDescription}>
            Campos opcionais que ajudarão no processo de aprovação do seu cadastro.
          </Text>

          <Spacer size="md" />

          <ControlledFormField
            control={control}
            name="department"
            placeholder="Departamento"
            autoCapitalize="words"
          />

          <ControlledFormField
            control={control}
            name="position"
            placeholder="Cargo"
            autoCapitalize="words"
          />

          <ControlledFormField
            control={control}
            name="phone"
            placeholder="Telefone"
            keyboardType="phone-pad"
            mask={phoneMask}
          />

          <Spacer size="md" />

          <Button
            title={isLoading ? "Criando cadastro..." : "Criar cadastro"}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            {...buttonProps}
          />

          <TouchableOpacity 
            style={styles.loginLinkContainer}
            onPress={() => navigation.goBack()}
          >
            <Text variant="body" color="text.link" style={styles.loginLinkText}>
              Já possui cadastro? Fazer login
            </Text>
          </TouchableOpacity>
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

