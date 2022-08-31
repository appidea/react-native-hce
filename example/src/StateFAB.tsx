import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import type { ControlProps } from './ControlProps';

const activeBtn = require('./images/btn-active.png');
const inactiveBtn = require('./images/btn-inactive.png');

const StateFab = ({ simulationEnabled, terminateSimulation, startSimulation }: ControlProps) => {
  return (
    <View style={{ flexDirection: 'row', position: 'absolute', bottom: 15, right: 15 }}>
      <TouchableOpacity onPress={() => simulationEnabled ? terminateSimulation() : startSimulation()}>
        <Image style={{width: 80, height: 80}}
               source={simulationEnabled ? activeBtn : inactiveBtn} />
      </TouchableOpacity>
    </View>
  );
};

export default StateFab;
