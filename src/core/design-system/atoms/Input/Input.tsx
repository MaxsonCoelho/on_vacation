import React, { useState } from 'react';
import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../../tokens';
import { InputProps } from './types';
import { styles, getInputStyles } from './styles';
import { Icon } from '../Icon/Icon';

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  error,
  disabled = false,
  placeholder,
  rightIcon,
  onRightIconPress,
  inputContainerStyle,
  style,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const inputStyles = getInputStyles(focused, !!error, disabled);

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, inputStyles.container, inputContainerStyle]}>
        <TextInput
          style={[styles.input, inputStyles.input, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.secondary}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress || disabled}
            style={styles.iconContainer}
          >
            <Icon
              name={rightIcon}
              size={theme.typography.fontSize.subtitle}
              color={error ? 'status.error' : 'text.secondary'}
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
