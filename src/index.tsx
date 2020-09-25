import { NativeModules, Platform } from 'react-native';
const { Hce } = NativeModules;

type HCEApplication = {
  type: string;
  content: any;
};

export enum NFCContentType {
  Text = 'text',
  URL = 'url',
}

export class NFCTag implements HCEApplication {
  constructor(contentType: NFCContentType, content: string) {
    this.type = 'NFCTag';
    this.content = {
      contentType,
      content,
    };
  }

  content: any;
  type: string;
}

class HCESimulation {
  constructor(application: HCEApplication) {
    this.application = application;
    this.active = false;
  }

  terminate = async () => {
    await Hce.setEnabled(false);
    this.active = false;
  };

  start = async () => {
    if (Platform.OS !== 'android') {
      throw new Error('react-native-hce does not support this platform');
    }

    if (this.application instanceof NFCTag) {
      await Hce.setContent(
        this.application.content.contentType,
        this.application.content.content
      );
      await Hce.setEnabled(true);
      this.active = true;

      return this;
    }

    throw new Error('Unrecognized app type.');
  };

  application: any;
  active: boolean;
}

export default HCESimulation;
