/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { DataLayer } from './DataLayerTypes';

const activeBtn = require('./images/btn-active.png');
const inactiveBtn = require('./images/btn-inactive.png');

const StateFAB = ({ enabled, switchSession }: DataLayer) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => switchSession(!enabled)}>
      <Image style={styles.icon}
             source={enabled ? activeBtn : inactiveBtn} />
    </TouchableOpacity>
  </View>
);

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

export default StateFAB;
