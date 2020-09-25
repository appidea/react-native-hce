import type HCEApplication from "./HCEApplication";
import { NativeModules, Platform } from 'react-native';
import NFCTagType4, { NFCContentType } from './NFCTagType4';

const { Hce } = NativeModules;

class HCESession {
  /**
   * Initializes and controls the session of HCE session.
   * @param application HCE application to initialize.
   */
  constructor(application: HCEApplication) {
    this.application = application;
    this.active = false;
  }

  /**
   * Stops the HCE session.
   */
  terminate = async () => {
    await Hce.setEnabled(false);
    this.active = false;
  };

  /**
   * Starts the HCE session.
   */
  start = async () => {
    if (Platform.OS !== 'android') {
      throw new Error('react-native-hce does not support this platform');
    }

    if (this.application instanceof NFCTagType4) {
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

  /**
   * Indication, if the session is still active.
   */
  active: boolean;
}

export default HCESession;
export { NFCTagType4, NFCContentType };
