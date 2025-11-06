import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../utils/constants';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  containerStyle?: ViewStyle;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  value,
  onValueChange,
  options,
  placeholder,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.pickerContainer, error && styles.pickerError]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {placeholder && (
            <Picker.Item label={placeholder} value="" enabled={false} />
          )}
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray[700],
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  pickerError: {
    borderColor: COLORS.danger,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.danger,
  },
});

