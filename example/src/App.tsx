/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import HCESession, { NFCContentType, NFCTagType4 } from 'react-native-hce';
import SetupView from './SetupView';
import LogView from './LogView';
import NavButton from './Controls/NavButton';
import StateFab from './StateFAB';

import type { ControlProps, NFCTagReactStateProps } from './ControlProps';

enum Views {
  VIEW_SETUP,
  VIEW_LOG
}

const defaultProps: NFCTagReactStateProps = {
  content: "",
  type: NFCTagType4.stringFromContentType(NFCContentType.Text),
  writable: false
};

const App: React.FC = (): JSX.Element => {
  const [nfcTagProps, setNfcTagProps] = useState<NFCTagReactStateProps>(defaultProps);
  const [logMsg, setLogMsg] = useState<Array<any>>([]);
  const [currentView, setCurrentView] = useState<Views>(Views.VIEW_SETUP);
  const [session, setSession] = useState<HCESession | null>(null);
  const listener = useRef<any>(null);

  const terminateSession = useCallback(async () => {
    if (!session) {
      return;
    }

    await session.terminate();
    setSession(null);
  }, [session, setSession]);

  const startSession = useCallback(async () => {
    const tag = new NFCTagType4({
      type: NFCTagType4.contentTypeFromString(nfcTagProps.type),
      content: nfcTagProps.content,
      writable: nfcTagProps.writable
    });

    const instance = await new HCESession(tag).start();

    setSession(instance);
  }, [setSession, nfcTagProps]);

  const getExistingSession = useCallback(async () => {
    const instance: (HCESession|null) = await HCESession.getExistingSession();

    if (!instance) {
      return;
    }

    setSession(instance);
  }, [setSession]);

  const updateProp = useCallback((prop: string, value: any) => {
    setNfcTagProps((state: any) => ({...state, [prop]: value}));
    void terminateSession();
  }, [setNfcTagProps, terminateSession]);

  const logger = useCallback((eventData) => {
    setLogMsg(msg => ([...msg, {
      time: (new Date()).toISOString(),
      message: eventData
    }]));
  }, [setLogMsg]);

  useEffect(() => {
    void getExistingSession()
  }, [getExistingSession]);

  useEffect(() => {
    if (session) {
      listener.current = session.addListener('hceState', logger);

      setNfcTagProps({
        content: session.application.content.content,
        type: NFCTagType4.stringFromContentType(session.application.content.type),
        writable: session.application.content.writable
      })
    } else {
      listener.current?.remove();
    }
  }, [session, logger, listener]);

  const stateControlProps: ControlProps = {
    nfcTagProps, updateProp,
    session, startSession, terminateSession,
    logMsg
  }

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
        {currentView === Views.VIEW_SETUP && <SetupView {...stateControlProps} />}
        {currentView === Views.VIEW_LOG && <LogView {...stateControlProps} />}
      </View>

      <StateFab {...stateControlProps} />
    </View>
  );
}

export default App;

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

