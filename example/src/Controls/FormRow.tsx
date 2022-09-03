/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FormRowProps {
  label: string;
  children: any;
}

const FormRow = ({ label, children }: FormRowProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10, width: '100%', alignItems: 'flex-start' },
  label: {
    fontSize: 12,
    color: '#737373',
    letterSpacing: 1,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingLeft: 6,
  },
  content: { width: '100%' },
});

export default FormRow;
