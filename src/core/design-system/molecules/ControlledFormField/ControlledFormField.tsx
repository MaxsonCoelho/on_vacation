import React from 'react';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { FormField } from '../FormField/FormField';
import { FormFieldProps } from '../FormField/types';

// Omitimos value e onChangeText pois serão controlados pelo react-hook-form
type ControlledFormFieldProps<T extends FieldValues> = Omit<FormFieldProps, 'value' | 'onChangeText' | 'error'> & {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
  mask?: (value: string) => string;
};

export const ControlledFormField = <T extends FieldValues>({
  control,
  name,
  rules,
  mask,
  ...props
}: ControlledFormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <FormField
          {...props}
          value={value}
          onChangeText={(text) => {
            const maskedText = mask ? mask(text) : text;
            onChange(maskedText);
          }}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  );
};
