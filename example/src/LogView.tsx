import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ControlProps } from './ControlProps';

const LogView = ({ logMsg } : ControlProps) => {
  return (
    <View>
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
};


const styles = StyleSheet.create({
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

export default LogView;
