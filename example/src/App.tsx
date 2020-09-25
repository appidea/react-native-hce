import React, { useCallback, useState, useRef } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import HCESimulation, { NFCContentType, NFCTag } from 'react-native-hce';

export default function App() {
  const [content, setContent] = useState<string>('');
  const [contentType, setContentType] = useState<NFCContentType>(NFCContentType.Text);

  const simulationInstance = useRef<HCESimulation | undefined>();
  const [simulationEnabled, setSimulationEnabled] = useState<boolean>(false);

  const terminateSimulation = useCallback(async () => {
    const instance = simulationInstance.current;

    if (!instance) {
      return;
    }

    await instance.terminate();
    setSimulationEnabled(instance.active);
  }, [setSimulationEnabled, simulationInstance]);

  const startSimulation = useCallback(async () => {
    const tag = new NFCTag(contentType, content);
    console.log(contentType, content);
    simulationInstance.current = await (new HCESimulation(tag)).start();
    setSimulationEnabled(simulationInstance.current.active);
  }, [setSimulationEnabled, simulationInstance, content, contentType]);

  const selectNFCType = useCallback(type => {
    setContentType(type);
    console.log(type);
    void terminateSimulation();
  }, [setContentType, terminateSimulation]);

  const selectNFCContent = useCallback(text => {
    setContent(text);
    void terminateSimulation();
  }, [setContent, terminateSimulation]);

  return (
    <View style={styles.container}>
      <Text>Welcome to the HCE NFC Tag example.</Text>

      <View style={{flexDirection: 'row'}}>
        <Button title="Text content"
                onPress={() => selectNFCType(NFCContentType.Text)}
                disabled={contentType === NFCContentType.Text}  />

        <Button title="URL content"
                onPress={() => selectNFCType(NFCContentType.URL)}
                disabled={contentType === NFCContentType.URL} />
      </View>

      <TextInput onChangeText={text => selectNFCContent(text)}
                 value={content}
                 placeholder="Enter the content here." />

      <View style={{flexDirection: 'row'}}>
        { !simulationEnabled ? (
          <Button title="Start hosting the tag" onPress={() => startSimulation()} />
        ) : (
          <Button title="Stop hosting the tag" onPress={() => terminateSimulation()} />
        ) }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
