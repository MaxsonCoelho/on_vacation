import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ScreenContainer, 
  Text, 
  Button, 
  Spacer,
  FeedbackBottomSheet,
  ControlledFormField,
  Dropdown
} from '../../../../../core/design-system';
import { styles } from './styles';
import { UpdateProfileScreenProps } from './types';
import { theme } from '../../../../../core/design-system/tokens';
import { useAdminStore } from '../../store/useAdminStore';
import { updateProfileSchema, UpdateProfileFormData } from '../../../domain/schemas/updateProfileSchema';
import { phoneMask } from '../../../../../core/utils/masks';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminUsersStackParamList } from '../../../../../app/navigation/admin/stacks/AdminUsersStack';

const ROLE_OPTIONS = [
  { label: 'Colaborador', value: 'Colaborador' },
  { label: 'Gestor', value: 'Gestor' },
  { label: 'Administrador', value: 'Administrador' },
];

export const UpdateProfileScreen: React.FC<UpdateProfileScreenProps> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<AdminUsersStackParamList>>();
  const { userId, currentRole, currentDepartment, currentPosition, currentPhone } = route.params;
  const { updateProfile, isLoading } = useAdminStore();
  
  const [feedback, setFeedback] = useState<{
    visible: boolean;
    type: 'error' | 'success' | 'warning' | 'info';
    title: string;
    description: string;
    primaryAction?: { label: string; onPress: () => void };
  }>({
    visible: false,
    type: 'info',
    title: '',
    description: '',
  });

  const closeFeedback = () => {
    setFeedback(prev => ({ ...prev, visible: false }));
  };

  const { control, handleSubmit } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      role: currentRole as 'Colaborador' | 'Gestor' | 'Administrador',
      department: currentDepartment || '',
      position: currentPosition || '',
      phone: currentPhone || '',
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateProfile(
        userId,
        data.role,
        data.department || undefined,
        data.position || undefined,
        data.phone || undefined
      );
      
      setFeedback({
        visible: true,
        type: 'success',
        title: 'Perfil atualizado com sucesso!',
        description: 'As alterações foram salvas e já estão em vigor.',
        primaryAction: {
          label: "OK",
          onPress: () => {
            closeFeedback();
            navigation.goBack();
          }
        }
      });
    } catch (error: unknown) {
      let errorMessage = 'Não foi possível atualizar o perfil. Tente novamente.';
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('network') || msg.includes('conexão')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else {
          errorMessage = error.message;
        }
      }

      setFeedback({
        visible: true,
        type: 'error',
        title: 'Erro ao atualizar perfil',
        description: errorMessage,
        primaryAction: {
          label: "Tentar novamente",
          onPress: closeFeedback
        }
      });
    }
  };

  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <View style={styles.container}>
        <Text variant="h2" weight="bold" style={styles.title}>
          Atualizar Perfil
        </Text>

        <Text variant="body" color="text.secondary" style={styles.description}>
          Altere as informações abaixo. Os campos marcados são opcionais.
        </Text>

        <View style={styles.form}>
          <View style={styles.fieldContainer}>
            <Text variant="body" weight="semibold" style={styles.label}>
              Perfil *
            </Text>
            <Spacer size="xs" />
            <Controller
              control={control}
              name="role"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <Dropdown
                    options={ROLE_OPTIONS}
                    value={value}
                    onSelect={onChange}
                    placeholder="Selecione o perfil"
                  />
                  {error && (
                    <>
                      <Spacer size="xs" />
                      <Text variant="caption" color="status.error">
                        {error.message}
                      </Text>
                    </>
                  )}
                </>
              )}
            />
          </View>

          <Spacer size="lg" />

          <Text variant="h3" weight="semibold" style={styles.sectionTitle}>
            Informações Adicionais
          </Text>
          <Text variant="caption" color="text.secondary" style={styles.sectionDescription}>
            Campos opcionais que podem ser alterados ou adicionados.
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

          <Spacer size="xl" />

          <Button
            title={isLoading ? "Salvando..." : "Salvar alterações"}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            variant="primary"
          />

          <Spacer size="md" />

          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="outline"
            disabled={isLoading}
          />
        </View>
      </View>

      <FeedbackBottomSheet
        visible={feedback.visible}
        title={feedback.title}
        description={feedback.description}
        type={feedback.type}
        primaryAction={feedback.primaryAction}
        onClose={closeFeedback}
      />
    </ScreenContainer>
  );
};

