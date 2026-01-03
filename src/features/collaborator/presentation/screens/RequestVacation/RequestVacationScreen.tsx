import React, { useState } from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import { 
  ScreenContainer, 
  Text, 
  Button, 
  Spacer,
  ControlledFormField,
  Toast,
  ToastProps,
} from '../../../../../core/design-system';
import { dateMask } from '../../../../../core/utils';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { useVacationStore } from '../../store/useVacationStore';
import { styles } from './styles';

const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
};

// Schema Validation
const vacationSchema = z.object({
  startDate: z.string()
    .min(10, 'Data incompleta')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato inválido (DD/MM/AAAA)')
    .refine((val) => {
      const date = parseDate(val);
      if (!date) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    }, 'A data de início deve ser a partir de amanhã'),
  endDate: z.string()
    .min(10, 'Data incompleta')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato inválido (DD/MM/AAAA)')
    .refine((val) => parseDate(val) !== null, 'Data inválida'),
  reason: z.string().min(1, 'O motivo é obrigatório'),
}).refine((data) => {
  const start = parseDate(data.startDate);
  const end = parseDate(data.endDate);
  if (!start || !end) return false;
  return end >= start;
}, {
  message: 'A data de término deve ser posterior à data de início',
  path: ['endDate'],
});

type VacationFormData = z.infer<typeof vacationSchema>;

export const RequestVacationScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { createRequest, isLoading } = useVacationStore();
  
  const [toast, setToast] = useState<ToastProps>({
    visible: false,
    message: '',
    variant: 'success',
  });

  const { control, handleSubmit } = useForm<VacationFormData>({
    resolver: zodResolver(vacationSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      reason: '',
    }
  });

  const onSubmit = async (data: VacationFormData) => {
    if (!user?.id) {
      return;
    }

    try {
      await createRequest({
        userId: user.id,
        title: 'Solicitação de Férias', // Default title
        startDate: data.startDate,
        endDate: data.endDate,
        collaboratorNotes: data.reason,
      });

      setToast({
        visible: true,
        message: 'Solicitação enviada com sucesso!',
        variant: 'success',
        onDismiss: () => {
          setToast(prev => ({ ...prev, visible: false }));
          navigation.goBack();
        }
      });
    } catch (error) {
      console.error('[RequestVacation] Error creating request:', error);
      setToast({
        visible: true,
        message: 'Não foi possível enviar a solicitação.',
        variant: 'error',
        onDismiss: () => setToast(prev => ({ ...prev, visible: false }))
      });
    }
  };

  return (
    <>
      <ScreenContainer scrollable edges={['left', 'right']}>
        <View style={styles.container}>
          <View style={styles.form}>
            <ControlledFormField
              control={control}
              name="startDate"
              placeholder="Data de início"
              keyboardType="numeric"
              maxLength={10}
              rightIcon="calendar-blank"
              mask={dateMask}
            />
            
            <Spacer size="md" />

            <ControlledFormField
              control={control}
              name="endDate"
              placeholder="Data de término"
              keyboardType="numeric"
              maxLength={10}
              rightIcon="calendar-blank"
              mask={dateMask}
            />

            <Spacer size="md" />

            <ControlledFormField
              control={control}
              name="reason"
              placeholder="Observações (opcional)"
              multiline
              numberOfLines={4}
              inputContainerStyle={styles.textAreaContainer}
              style={styles.textAreaInput}
            />
            
            <Spacer size="xs" />
            <Text variant="caption" color="text.secondary">
              Mínimo de 5 dias de férias.
            </Text>

            <Spacer size="xl" />

            <Button 
              title="Enviar solicitação" 
              onPress={handleSubmit(onSubmit)} 
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
        </View>
      </ScreenContainer>
      <Toast
        visible={toast.visible}
        message={toast.message}
        variant={toast.variant}
        duration={1500}
        onDismiss={toast.onDismiss}
      />
    </>
  );
};
