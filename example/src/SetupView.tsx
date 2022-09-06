/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import React from 'react';
import { Image, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NFCTagType4NDEFContentType, NFCTagType4 } from 'react-native-hce';
import FormRow from './Controls/FormRow';
import type { DataLayer } from './DataLayerTypes';

const logo = require('../../logo.png');

const HCEPickerItem: any = Picker.Item;
const HCEPicker: any = Picker;

const App = ({ nfcTagProps, updateProp }: DataLayer) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Image source={logo} style={styles.headerLogo} resizeMode="cover" />
      <Text style={styles.headerText}>
        NFC Type4 Tag Emulator - Example Application
      </Text>
    </View>

    <FormRow label="Select content type">
      <HCEPicker
        selectedValue={nfcTagProps.type}
        style={styles.typePicker}
        onValueChange={(itemValue: string) => updateProp('type', itemValue)}
      >
        <HCEPickerItem
          label="Text"
          key={1}
          value={NFCTagType4.stringFromContentType(
            NFCTagType4NDEFContentType.Text
          )}
        />
        <HCEPickerItem
          label="URL"
          key={2}
          value={NFCTagType4.stringFromContentType(
            NFCTagType4NDEFContentType.URL
          )}
        />
      </HCEPicker>
    </FormRow>

    <FormRow label="Set content">
      <TextInput
        onChangeText={(text: string) => updateProp('content', text)}
        autoCapitalize="none"
        spellCheck={false}
        value={nfcTagProps.content}
        style={styles.fieldContent}
        placeholder="Put the content here."
      />
    </FormRow>

    <FormRow label="Is tag writable?">
      <Switch
        onChange={() => updateProp('writable', !nfcTagProps.writable)}
        value={nfcTagProps.writable}
        style={styles.fieldWritable}
      />
    </FormRow>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerLogo: {
    height: 160,
    aspectRatio: 1.516,
  },
  headerText: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  fieldWritable: {
    width: 50,
    marginVertical: 10,
    marginHorizontal: 4,
  },
  fieldContent: {
    paddingHorizontal: 16,
  },
  typePicker: {
    height: 50,
  },
});

export default App;
