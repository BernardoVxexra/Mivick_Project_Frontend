import React from 'react';
import { TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle } from 'react-native';

type FirstTextFieldProps = TextInputProps & {
  style?: StyleProp<ViewStyle>;
};

const FirstTextField = ({ style, ...props }: FirstTextFieldProps) => (
  <TextInput
    style={[styles.input, style]}
    {...props}
  />
);

const styles = StyleSheet.create({
  input: {
    width: 365,
    height: 49,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f8f8fa',
    marginBottom: 12,
  },
});

export { FirstTextField };