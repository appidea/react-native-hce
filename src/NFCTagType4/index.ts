import type HCEApplication from "../HCEApplication";

export enum NFCContentType {
  Text = 'text',
  URL = 'url',
}

export interface NFCTagType4Props {
  /**
   * The NDEF type: text or url. Use the values from NFCContentType
   */
  type: NFCContentType,
  /**
   * The actual content of NDEF message.
   */
  content: string,
  /**
   * Defines if the tag is writable.
   */
  writable: boolean
}

class NFCTagType4 implements HCEApplication {
  /**
   * Creates a new instance of NFCTagType4 containing an NDEF message.
   * @param props Props of the tag
   */
  constructor(props: NFCTagType4Props) {
    this.type = 'NFCTag';
    this.content = {...props};
  }

  content: any;
  type: string;

  static contentTypeFromString(type: string) : NFCContentType {
    switch (type) {
      case "text":
        return NFCContentType.Text;
      case "url":
        return NFCContentType.URL;
      default:
        throw new Error("Unknown type");
    }
  }

  static stringFromContentType(type: NFCContentType) : string {
    switch (type) {
      case NFCContentType.URL:
        return "url";
      case NFCContentType.Text:
        return "text";
      default:
        throw new Error("Unknown type");
    }
  }
}

export default NFCTagType4;
