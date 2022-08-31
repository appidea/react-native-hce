import React, { useCallback, useState, useRef, useEffect } from 'react';
import {StyleSheet, View, } from 'react-native';
import HCESession, { NFCContentType, NFCTagType4 } from 'react-native-hce';
import SetupView from './SetupView';
import LogView from './LogView';
import NavButton from './Controls/NavButton';
import StateFab from './StateFAB';

import type {ControlProps} from './ControlProps';

enum Views {
  VIEW_SETUP,
  VIEW_LOG
}

const App: React.FC = (): JSX.Element => {
  const [content, setContent] = useState<string>('');
  const [contentType, setContentType] = useState<NFCContentType>(NFCContentType.Text);
  const [contentWritable, setContentWritable] = useState<boolean>(false);
  const simulationInstance = useRef<HCESession | undefined>();
  const [simulationEnabled, setSimulationEnabled] = useState<boolean>(false);
  const [logMsg, setLogMsg] = useState<Array<any>>([]);
  const listener = useRef<any>(null);

  const terminateSimulation = useCallback(async () => {
    const instance = simulationInstance.current;

    if (!instance) {
      return;
    }

    await instance.terminate();
    setSimulationEnabled(instance.active);
    listener.current?.remove();
  }, [setSimulationEnabled, simulationInstance, listener]);

  const startSimulation = useCallback(async () => {
    const tag = new NFCTagType4(contentType, content, contentWritable);
    simulationInstance.current = await new HCESession(tag).start();
    setSimulationEnabled(simulationInstance.current.active);

    listener.current = simulationInstance.current.addListener('hceState', (eventData) => {
      setLogMsg(msg => ([...msg, {
        time: (new Date()).toISOString(),
        message: eventData
      }]));
    });
  }, [setSimulationEnabled, simulationInstance, content, contentWritable, contentType, listener, setLogMsg]);

  const selectNFCType = useCallback(
    (type) => {
      setContentType(type);
      void terminateSimulation();
    },
    [setContentType, terminateSimulation]
  );

  const selectNFCContent = useCallback(
    (text) => {
      setContent(text);
      void terminateSimulation();
    },
    [setContent, terminateSimulation]
  );

  const toggleNFCWritable = useCallback(
    () => {
      setContentWritable(state => !state);
      void terminateSimulation();
    },
    [setContentWritable, terminateSimulation]
  );

  const getExistingSession = useCallback(async () => {
    const session: (HCESession|null) = await HCESession.getExistingSession();

    if (!session) {
      return;
    }

    setContent(session.application.content.content);
    setContentType(session.application.content.contentType);
    setContentWritable(session.application.content.writable);
    setSimulationEnabled(session.active);

    simulationInstance.current = session;
  }, [setContent, setContentType, setContentWritable, setSimulationEnabled]);

  useEffect(() => {
    void getExistingSession()
  }, [getExistingSession]);

  const [currentView, setCurrentView] = useState<Views>(Views.VIEW_SETUP);

  const stateControlProps: ControlProps = {
    contentType, selectNFCType, content, selectNFCContent, contentWritable, toggleNFCWritable,
    simulationEnabled, startSimulation, terminateSimulation,
    logMsg
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', margin: 10}}>
        <NavButton title="Set Up"
                   onPress={() => setCurrentView(Views.VIEW_SETUP)}
                   active={currentView === Views.VIEW_SETUP} />

        <NavButton title="Event Log"
                   onPress={() => setCurrentView(Views.VIEW_LOG)}
                   active={currentView === Views.VIEW_LOG} />
      </View>

      <View style={{flex: 1, width: '100%'}}>
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
  }
});

