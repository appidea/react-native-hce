/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import React from 'react';
import { View, Text } from 'react-native';

interface FormRowProps {
  label: string,
  children: any
}

const FormRow = ({label, children}: FormRowProps) => {
  return (
    <View style={{marginBottom: 10, width: '100%', alignItems: 'flex-start'}}>
      <Text style={{fontSize: 12, color: '#737373', letterSpacing: 1, fontWeight: 'bold', textTransform: 'uppercase', paddingLeft: 6}}>{label}</Text>
      <View style={{width: '100%'}}>
        {children}
      </View>
    </View>
  );
};

export default FormRow;
