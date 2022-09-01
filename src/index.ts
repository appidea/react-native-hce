import type HCEApplication from './HCEApplication';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import NFCTagType4, { NFCContentType, NFCTagType4Props } from './NFCTagType4';

const { Hce } = NativeModules;
const eventEmitter = new NativeEventEmitter(Hce);

class HCESession {
  /**
   * Initializes and controls the session of HCE session.
   * @param application HCE application to initialize.
   */
  constructor(application: HCEApplication) {
    this.application = application;
    this.active = false;
  }

  addListener = eventEmitter.addListener;

  static async getExistingSession(): Promise<(HCESession|null)> {
    const active = await Hce.getEnabled();

    if (!active) {
      return null;
    }

    const content = await Hce.getContent();

    if (!content) {
      return null;
    }

    const nfcProps: NFCTagType4Props = {
      type: NFCTagType4.contentTypeFromString(content.type),
      content: content.content,
      writable: content.writable
    };

    const tag = new NFCTagType4(nfcProps);
    const session = new HCESession(tag);
    session.active = active;

    return session;
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

    await Hce.setContent(this.application.content);
    await Hce.setEnabled(true);

    this.active = true;

    return this;
  };

  application: HCEApplication;

  /**
   * Indication, if the session is still active.
   */
  active: boolean;
}

export default HCESession;
export { NFCTagType4, NFCContentType };
