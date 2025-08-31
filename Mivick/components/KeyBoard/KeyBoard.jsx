import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const keys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['←', '0', 'OK'],
];

const KeyBoard = ({ onKeyPress, style }) => (
  <View style={[styles.container, style]}>
    {keys.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.key}
            onPress={() => onKeyPress && onKeyPress(key)}
          >
            <Text style={styles.keyText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#f8f8fa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  key: {
    backgroundColor: '#e0e1dd',
    marginHorizontal: 6,
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 20,
    color: '#22223b',
    fontWeight: 'bold',
  },
});

export default KeyBoard;