/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { HCESessionProvider } from 'react-native-hce';
import SetupView from './SetupView';
import LogView from './LogView';
import NavButton from './Controls/NavButton';
import StateFab from './StateFAB';
import type { DataLayer } from './DataLayerTypes';
import useDataLayer from './useDataLayer';

enum Views {
  VIEW_SETUP,
  VIEW_LOG
}

const App: React.FC = (): JSX.Element => {
  const [currentView, setCurrentView] = useState<Views>(Views.VIEW_SETUP);
  const dataLayer: DataLayer = useDataLayer();

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <NavButton title="Set Up"
                   onPress={() => setCurrentView(Views.VIEW_SETUP)}
                   active={currentView === Views.VIEW_SETUP} />

        <NavButton title="Event Log"
                   onPress={() => setCurrentView(Views.VIEW_LOG)}
                   active={currentView === Views.VIEW_LOG} />
      </View>

      <View style={styles.content}>
        {dataLayer.loading && <Text>Loading...</Text>}
        {currentView === Views.VIEW_SETUP && <SetupView {...dataLayer} />}
        {currentView === Views.VIEW_LOG && <LogView {...dataLayer} />}
      </View>

      <StateFab {...dataLayer} />
    </View>
  );
}

export default () => (
  <HCESessionProvider>
    <App />
  </HCESessionProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigation: {
    flexDirection: 'row',
    margin: 10
  },
  content: {
    flex: 1,
    width: '100%'
  }
});

