import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text, Icon } from '../../atoms';
import { theme } from '../../tokens';
import { DropdownProps } from './types';
import { styles } from './styles';

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  disabled = false,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={toggleDropdown}
        style={[styles.trigger, disabled && styles.triggerDisabled]}
      >
        <Text
          variant="body"
          color={selectedOption ? 'text.primary' : 'text.secondary'}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Icon
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={theme.typography.fontSize.title}
          color={disabled ? 'action.disabledText' : 'text.secondary'}
        />
      </Pressable>

      {isOpen && (
        <View style={styles.menu}>
          <ScrollView nestedScrollEnabled>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={[styles.option, isSelected && styles.optionSelected]}
                >
                  <Text
                    variant="body"
                    color={isSelected ? 'primary' : 'text.primary'}
                    style={styles.optionText}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Icon
                      name="check"
                      size={theme.typography.fontSize.body}
                      color="primary"
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
