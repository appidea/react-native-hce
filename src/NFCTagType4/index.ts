/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import type { HCEApplication } from '../HCEApplication';

/**
 * The supported NDEF record types.
 */
export enum NFCTagType4NDEFContentType {
  /** Text record represented by ``tnf = TNF_WELL_KNOWN`` and ``rtd = RTD_TEXT`` */
  Text = 'text',
  /** URL record represented by ``tnf = TNF_WELL_KNOWN`` and ``rtd = RTD_URI`` */
  URL = 'url',
}

/**
 * Abstraction for the internal NDEF record.
 *
 * __NOTE__: Not all the NDEF record types specified by NFC Forum are supported for now.
 * Find out the currently supported types {@link NFCTagType4NDEFContentType here}.
 */
export interface NFCTagType4NDEFRecord {
  /**
   * The NDEF type: text or url.
   *
   * Use the values from {@link NFCTagType4NDEFContentType}.
   */
  type: NFCTagType4NDEFContentType;
  /**
   * The content of a message.
   *
   * Related to declared type.
   * - when ``type === NFCTagType4NDEFContentType.Text``, it should be a plain text (language declared in en)\
   *   Example: ``Hello NFC World``.
   * - when ``type === NFCTagType4NDEFContentType.URL``, it should be the URL (remember that URL address is such address, which should include the protocol).\
   *   Example: ``https://appidea.pl``.
   */
  content: string;
  /**
   * Defines if the tag is writable.
   *
   * If true, it can be overwritten by calling the adequate APDUs by the card reader. The {@link HCESession.application} property of
   * the current session can change in any time. For notification purposes, session will receive
   * the specific events (that events of course will not fire, when application is in the background or the main
   * activity is not running at all).
   */
  writable: boolean;
}

/**
 * Represents the NFC Tag Type 4 application.
 *
 * You can create the instance by calling the constructor.
 */
export class NFCTagType4 implements HCEApplication {
  /**
   * Creates a new instance of NFCTagType4 containing an NDEF message.
   * @param props Props of the tag
   *
   * @example
   * ```
   * const tag = new NFCTagType4({
   *   type: NFCTagType4NDEFContentType.Text,
   *   content: "Hello NFC World!",
   *   writable: false
   * });
   * ...
   * hceSession.setApplication(tag);
   * ```
   */
  constructor(props: NFCTagType4NDEFRecord) {
    this.type = 'NFCTag';
    this.content = { ...props };
  }

  /**
   * The NDEF record - a content of application.
   */
  content: NFCTagType4NDEFRecord;

  /**
   * Internal unique identifier of application type.
   *
   * @internal
   * @private
   */
  type: string;

  /**
   * Maps the string to {@link NFCTagType4NDEFContentType}.
   *
   * @param type
   */
  static contentTypeFromString(type: string): NFCTagType4NDEFContentType {
    switch (type) {
      case 'text':
        return NFCTagType4NDEFContentType.Text;
      case 'url':
        return NFCTagType4NDEFContentType.URL;
      default:
        throw new Error('Unknown type');
    }
  }

  /**
   * Maps the {@link NFCTagType4NDEFContentType} to string.
   *
   * @param type
   */
  static stringFromContentType(type: NFCTagType4NDEFContentType): string {
    switch (type) {
      case NFCTagType4NDEFContentType.URL:
        return 'url';
      case NFCTagType4NDEFContentType.Text:
        return 'text';
      default:
        throw new Error('Unknown type');
    }
  }
}
