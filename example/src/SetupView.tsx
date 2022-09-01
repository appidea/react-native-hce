import React  from 'react';
import {
  Image,
  StyleSheet, Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { NFCContentType, NFCTagType4 } from 'react-native-hce';
import FormRow from './Controls/FormRow';
import type { ControlProps } from './ControlProps';
const logo = require('../../logo.png');

const HCEPickerItem: any = Picker.Item;
const HCEPicker: any = Picker;

const App = ({ nfcTagProps, updateProp }: ControlProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.headerLogo} resizeMode="cover" />
        <Text style={styles.headerText}>
          NFC Type4 Tag Emulator - Example Application
        </Text>
      </View>

      <FormRow label="Select content type">
        <HCEPicker selectedValue={nfcTagProps.type}
                   onValueChange={(itemValue: string) => updateProp('type', itemValue)}>
          <HCEPickerItem label="Text"
                         value={NFCTagType4.stringFromContentType(NFCContentType.Text)} />
          <HCEPickerItem label="URL"
                         value={NFCTagType4.stringFromContentType(NFCContentType.URL)} />
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
        <Switch onChange={() => updateProp('writable', !nfcTagProps.writable)}
                value={nfcTagProps.writable}
                style={styles.fieldWritable} />
      </FormRow>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  headerLogo: {
    height: 160,
    aspectRatio: 1.516
  },
  headerText: {
    fontWeight: 'bold',
    marginTop: 10
  },
  fieldWritable: {
    width: 50,
    marginVertical: 10,
    marginHorizontal: 4
  },
  fieldContent: {
    paddingHorizontal: 16
  }
});

export default App;

