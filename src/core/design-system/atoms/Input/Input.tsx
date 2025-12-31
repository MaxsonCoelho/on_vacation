import React, { useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import { theme } from '../../tokens';
import { InputProps } from './types';
import { styles, getInputStyles } from './styles';

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  error,
  disabled = false,
  placeholder,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const inputStyles = getInputStyles(focused, !!error, disabled);

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, inputStyles.container]}>
        <TextInput
          style={[styles.input, inputStyles.input]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.secondary}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
