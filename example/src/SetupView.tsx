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

const HCEPickerItem: any = Picker.Item;
const HCEPicker: any = Picker;

const App = ({ contentType, selectNFCType, content, selectNFCContent, contentWritable, toggleNFCWritable }: ControlProps) => {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Image source={require('../../logo.png')} style={{height: 160, aspectRatio: 1.516}} resizeMode="cover" />
        <Text style={{fontWeight: 'bold', marginTop: 10}}>NFC Type4 Tag Emulator - Example Application</Text>
      </View>

      <FormRow label="Select content type">
        <HCEPicker
          selectedValue={contentType}
          onValueChange={(itemValue: string) => selectNFCType(NFCTagType4.contentTypeFromString(itemValue))}>
          <HCEPickerItem label="Text" value={NFCContentType.Text.valueOf()} />
          <HCEPickerItem label="URL" value={NFCContentType.URL.valueOf()} />
        </HCEPicker>
      </FormRow>

      <FormRow label="Set content">
        <TextInput
          onChangeText={(text) => selectNFCContent(text)}
          autoCapitalize="none"
          spellCheck={false}
          value={content}
          style={{paddingHorizontal: 16}}
          placeholder="Enter the content here."
        />
      </FormRow>

      <FormRow label="Is tag writable?">
        <Switch onChange={() => toggleNFCWritable()} value={contentWritable} style={{width: 50, marginVertical: 10, marginHorizontal: 4}} />
      </FormRow>
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

