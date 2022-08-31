import type HCEApplication from "../HCEApplication";

export enum NFCContentType {
  Text = 'text',
  URL = 'url',
}

class NFCTagType4 implements HCEApplication {
  /**
   * Creates a new instance of NFCTagType4 containing an NDEF message.
   * @param contentType The NDEF type: text or url. Use the values from NFCContentType
   * @param content The actual content of NDEF message.
   */
  constructor(contentType: NFCContentType, content: string, writable: boolean) {
    this.type = 'NFCTag';
    this.content = {
      contentType,
      content,
      writable
    };
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
}

export default NFCTagType4;
