import React, { useCallback, useState, useRef } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet, Switch,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import HCESession, { NFCContentType, NFCTagType4 } from 'react-native-hce';

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

  return (
    <View style={styles.container}>
      <Text>Welcome to the HCE NFC Tag example.</Text>

      <View style={{ flexDirection: 'row' }}>
        <Button
          title="Text content"
          onPress={() => selectNFCType(NFCContentType.Text)}
          disabled={contentType === NFCContentType.Text}
        />

        <Button
          title="URL content"
          onPress={() => selectNFCType(NFCContentType.URL)}
          disabled={contentType === NFCContentType.URL}
        />
      </View>

      <TextInput
        onChangeText={(text) => selectNFCContent(text)}
        value={content}
        placeholder="Enter the content here."
      />

      <View>
        <Switch onChange={() => toggleNFCWritable()} value={contentWritable} />
        <Text>Is tag writable?</Text>
      </View>

      <View style={{ flexDirection: 'row' }}>
        {!simulationEnabled ? (
          <Button
            title="Start hosting the tag"
            onPress={() => startSimulation()}
          />
        ) : (
          <Button
            title="Stop hosting the tag"
            onPress={() => terminateSimulation()}
          />
        )}
      </View>

      <View style={styles.log}>
        <View style={styles.logTitle}>
          <Text style={styles.logTitleText}>Event Log</Text>
        </View>

        <ScrollView style={styles.logContent}>
          <View style={styles.logContentInner}>
            {logMsg.map((line, key) => (
              <Text key={key}>{line.time + ' ' + line.message}</Text>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default App;

interface Styles {
  container: ViewStyle;
  log: ViewStyle;
  logTitle: ViewStyle;
  logTitleText: TextStyle;
  logContent: ViewStyle;
  logContentInner: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  log: {
    width: '100%',
    borderWidth: 1,
    marginTop: 20
  },
  logTitle: {
    backgroundColor: '#000'
  },
  logTitleText: {
    color: '#FFF',
    padding: 8
  },
  logContent: {
    height: 200
  },
  logContentInner: {
    padding: 8,
  }
});
