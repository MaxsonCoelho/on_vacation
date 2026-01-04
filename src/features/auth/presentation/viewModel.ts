import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { useAuthStore } from './store/useAuthStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useLoginViewModel = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signIn, signOut, isLoading } = useAuthStore();
  
  const [feedback, setFeedback] = useState<{
    visible: boolean;
    type: 'error' | 'success' | 'warning' | 'info';
    title: string;
    description: string;
    primaryAction?: { label: string; onPress: () => void };
    secondaryAction?: { label: string; onPress: () => void };
  }>({
    visible: false,
    type: 'error',
    title: '',
    description: '',
  });

  const closeFeedback = () => {
    setFeedback(prev => ({ ...prev, visible: false }));
  };

  const handleLogin = async (role: string, email: string, password: string) => {
    try {
      const user = await signIn(email, password);
      
      if (user.role !== role) {
        await signOut();
        setFeedback({
          visible: true,
          type: 'error',
          title: 'Perfil incorreto',
          description: `Este usuário não possui permissão de ${role}. O usuário logado tem permissão de ${user.role}. Por favor, entre com um usuário válido ou troque o perfil de acesso.`,
          primaryAction: {
            label: "Trocar perfil",
            onPress: () => {
              closeFeedback();
              navigation.navigate('RoleSelection');
            }
          },
          secondaryAction: {
            label: "Cancelar",
            onPress: closeFeedback
          }
        });
        return;
      }
      
    } catch (error: unknown) {
      let errorMessage = 'Ocorreu um erro ao tentar fazer login.';
      let feedbackType: 'error' | 'success' | 'warning' | 'info' = 'error';
      let feedbackTitle = 'Erro no Login';
      
      if (error instanceof Error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('pendente de aprovação') || msg.includes('cadastro está pendente')) {
             feedbackType = 'info';
             feedbackTitle = 'Cadastro Pendente';
             errorMessage = 'Seu cadastro ainda está aguardando aprovação de um administrador. Você receberá uma notificação quando seu acesso for liberado.';
             setFeedback({
               visible: true,
               type: feedbackType,
               title: feedbackTitle,
               description: errorMessage,
               primaryAction: {
                 label: "Entendi",
                 onPress: closeFeedback
               }
             });
             return;
          } else if (msg.includes('invalid login credentials')) {
             errorMessage = 'E-mail ou senha incorretos.';
          } else if (msg.includes('missing email or phone')) {
             errorMessage = 'Por favor, informe o e-mail e a senha.';
          } else if (msg.includes('email not confirmed')) {
             errorMessage = 'E-mail não confirmado. Verifique sua caixa de entrada.';
          } else if (msg.includes('user not found')) {
             errorMessage = 'Usuário não encontrado.';
          } else if (msg.includes('too many requests')) {
             errorMessage = 'Muitas tentativas. Aguarde um momento e tente novamente.';
          } else if (msg.includes('network request failed')) {
             errorMessage = 'Erro de conexão. Verifique sua internet.';
          } else {
             errorMessage = error.message;
          }
      }

      setFeedback({
        visible: true,
        type: feedbackType,
        title: feedbackTitle,
        description: errorMessage,
        primaryAction: {
          label: "Tentar novamente",
          onPress: closeFeedback
        }
      });
    }
  };

  return {
    handleLogin,
    isLoading,
    feedback,
    closeFeedback
  };
};

export const useRegisterViewModel = () => {
  const navigation = useNavigation<NavigationProp>();
  const { register, isLoading } = useAuthStore();
  
  const [feedback, setFeedback] = useState<{
    visible: boolean;
    type: 'error' | 'success' | 'warning' | 'info';
    title: string;
    description: string;
    primaryAction?: { label: string; onPress: () => void };
    secondaryAction?: { label: string; onPress: () => void };
  }>({
    visible: false,
    type: 'error',
    title: '',
    description: '',
  });

  const closeFeedback = () => {
    setFeedback(prev => ({ ...prev, visible: false }));
  };

  const handleRegister = async (
    role: 'Colaborador' | 'Gestor' | 'Administrador',
    email: string,
    password: string,
    name: string,
    department?: string,
    position?: string,
    phone?: string
  ) => {
    try {
      await register(email, password, name, role, department, position, phone);
      
      setFeedback({
        visible: true,
        type: 'success',
        title: 'Cadastro realizado com sucesso!',
        description: 'Seu cadastro foi criado e está aguardando aprovação de um administrador. Você receberá uma notificação quando seu cadastro for aprovado e poderá fazer login.',
        primaryAction: {
          label: "Voltar para login",
          onPress: () => {
            closeFeedback();
            navigation.goBack();
          }
        }
      });
    } catch (error: unknown) {
      let errorMessage = 'Ocorreu um erro ao tentar criar seu cadastro.';
      if (error instanceof Error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('user already registered')) {
             errorMessage = 'Este e-mail já está cadastrado.';
          } else if (msg.includes('invalid email')) {
             errorMessage = 'E-mail inválido.';
          } else if (msg.includes('password')) {
             errorMessage = 'Senha inválida. A senha deve ter no mínimo 6 caracteres.';
          } else if (msg.includes('network request failed')) {
             errorMessage = 'Erro de conexão. Verifique sua internet.';
          } else {
             errorMessage = error.message;
          }
      }

      setFeedback({
        visible: true,
        type: 'error',
        title: 'Erro no Cadastro',
        description: errorMessage,
        primaryAction: {
          label: "Tentar novamente",
          onPress: closeFeedback
        }
      });
    }
  };

  return {
    handleRegister,
    isLoading,
    feedback,
    closeFeedback
  };
};
