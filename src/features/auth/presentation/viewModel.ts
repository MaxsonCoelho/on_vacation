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
          description: `Este usuário não possui permissão de ${role}. Por favor, entre com um usuário válido ou troque o perfil de acesso.`,
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
      if (error instanceof Error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('invalid login credentials')) {
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
        type: 'error',
        title: 'Erro no Login',
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
