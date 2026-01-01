import React, { useState } from 'react';
import { View } from 'react-native';
import { 
  ScreenContainer, 
  FormField, 
  Text, 
  Button, 
  Spacer 
} from '../../../../../core/design-system';
import { styles } from './styles';

export const RequestVacationScreen = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [observations, setObservations] = useState('');

  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <View style={styles.container}>
        <FormField
          placeholder="Data de início"
          value={startDate}
          onChangeText={setStartDate}
          rightIcon="calendar-blank"
        />
        
        <Spacer size="md" />
        
        <FormField
          placeholder="Data de término"
          value={endDate}
          onChangeText={setEndDate}
          rightIcon="calendar-blank"
        />

        <Spacer size="lg" />

        <FormField
          label="Observações"
          placeholder="Observações (opcional)"
          value={observations}
          onChangeText={setObservations}
          multiline
          numberOfLines={4}
          inputContainerStyle={styles.textAreaContainer}
          style={styles.textAreaInput}
        />
        
        <Text variant="caption" color="text.secondary" style={styles.helperText}>
          Mínimo de 5 dias de férias.
        </Text>

        <Spacer size="xl" />
        <Spacer size="xl" />

        <Button
          title="Enviar solicitação"
          onPress={() => {}}
        />
      </View>
    </ScreenContainer>
  );
};
