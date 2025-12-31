import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { 
  ScreenContainer, 
  Text, 
  Input, 
  Button, 
  Spacer
} from '../../../../../core/design-system';
import { styles } from './styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../../navigation/types';
import { theme } from '../../../../../core/design-system/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ route, navigation }) => {
  const { role } = route.params;
  const [email, setEmail] = useState('');

  const getButtonProps = () => {
    switch (role) {
      case 'Gestor':
        return {
          style: { backgroundColor: '#39FF14' }, // Neon Green
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

  const handleSendResetLink = () => {
    // Mock logic for sending reset link
    console.log('Reset link sent to', email);
    Alert.alert(
      'E-mail enviado',
      'Verifique sua caixa de entrada para redefinir sua senha.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.content}>
        <Text variant="h2" weight="bold" style={styles.title}>
          Recuperar Senha
        </Text>

        <View style={styles.subtitleContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text variant="body" color="text.link" style={styles.backLink}>
              Voltar ao Login
            </Text>
          </TouchableOpacity>
        </View>

        <Text variant="body" color="text.primary" style={styles.description}>
          Insira seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
        </Text>

        <View style={styles.form}>
          <Input
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Spacer size="md" />

          <Button
            title="Enviar Link"
            onPress={handleSendResetLink}
            disabled={!email}
            {...buttonProps}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
