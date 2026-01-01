import React from 'react';
import { View } from 'react-native';
import { Text, Input } from '../../atoms';
import { FormFieldProps } from './types';
import { styles } from './styles';

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  containerStyle,
  ...inputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          variant="label"
          color={error ? 'status.error' : 'text.primary'}
          style={styles.label}
        >
          {label}
        </Text>
      )}
      
      <Input
        error={error}
        {...inputProps}
      />
    </View>
  );
};
