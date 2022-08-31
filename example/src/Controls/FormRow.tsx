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
