import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface NavButtonProps {
  onPress: () => any,
  active: boolean,
  title: string
}

const NavButton = ({onPress, active, title}: NavButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={{margin: 10}}>
      <Text style={{fontWeight: active ? 'bold' : 'normal'}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default NavButton;
