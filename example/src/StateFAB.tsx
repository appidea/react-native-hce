import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { ControlProps } from './ControlProps';

const activeBtn = require('./images/btn-active.png');
const inactiveBtn = require('./images/btn-inactive.png');

const StateFab = ({ session, terminateSession, startSession }: ControlProps) => {
  const toggle = () => session ? terminateSession() : startSession();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle}>
        <Image style={styles.icon}
               source={session ? activeBtn : inactiveBtn} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    right: 15
  },
  icon: {
    width: 80,
    height: 80
  }
})

export default StateFab;
