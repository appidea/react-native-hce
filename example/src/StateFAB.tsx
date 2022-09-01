/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

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
