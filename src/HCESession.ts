/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import type HCEApplication from './HCEApplication';
import { NFCTagType4 } from './NFCTagType4';

const { Hce: NativeHce } = NativeModules;
const eventEmitter = new NativeEventEmitter(NativeHce);

let instance: (HCESession|null) = null;

const checkPlatform = (): void => {
  if (Platform.OS !== 'android') {
    throw new Error('react-native-hce does not support this platform');
  }
}

interface HCESessionEvents {
  HCE_STATE_CONNECTED: string;
  HCE_STATE_DISCONNECTED: string;
  HCE_STATE_ENABLED: string;
  HCE_STATE_DISABLED: string;
  HCE_STATE_READ: string;
  HCE_STATE_WRITE_FULL: string;
  HCE_STATE_WRITE_PARTIAL: string;
  HCE_STATE_UPDATE_APPLICATION: string;
}

export class HCESession {
  /**
   * Keeps the internal instance of HCE application
   *
   * @internal
   */
  application: HCEApplication | null;

  /**
   * Indication, if the session is still active.
   */
  enabled: boolean;

  /**
   * Container for event listeners.
   *
   * @internal
   */
  stateListeners: any[];

  static Events: HCESessionEvents = NativeHce.getConstants();

  /**
   * Constructs the HCE Session class.
   *
   * __NOTE__: Do not use the constructor directly. Use static "getInstance" to
   * get the already-present instance, if exists.
   */
  constructor() {
    this.enabled = false;
    this.application = null;
    this.stateListeners = [];

    this.addListener('hceState', this.handleStateUpdate.bind(this));
  }

  async handleStateUpdate(incomingEvent: string) {
    if (incomingEvent === HCESession.Events.HCE_STATE_WRITE_FULL) {
      await this.syncApplication();
    }

    this.stateListeners
      .filter(i => i !== null)
      .forEach(({ event, listener }) => {
        if (incomingEvent === event) {
          listener();
        }
      });
  }

  /**
   * Gets the instance of HCE Session.
   *
   * As there is only one HCE Session per application available,
   * use this function to get the instance instead of using the constructor.
   */
  static async getInstance(): Promise<(HCESession)> {
    checkPlatform();

    if (instance !== null) {
      return instance;
    }

    instance = new HCESession();
    await instance.syncApplication();

    return instance;
  }

  on(event: string, listener: () => void) {
    const index = this.stateListeners.push({ event, listener });
    return () => this.stateListeners[index] = null;
  }

  /**
   * Adds the listener to an event.
   *
   * @internal
   */
  addListener = (eventName: string, callback: (eventData: any) => any) => {
    return eventEmitter.addListener(eventName, (eventProp) => {
      callback(eventProp);
    });
  }

  /**
   * Executes the synchronization of state with native module.
   *
   * You should not use this function normally. The internal implementation mechanisms will
   * execute it if needed.
   *
   * @internal
   */
  async syncApplication(): Promise<void> {
    const content = await NativeHce.getContent();

    if (!content) {
      return;
    }

    const enabled = await NativeHce.getEnabled();

    this.application = new NFCTagType4({
      type: NFCTagType4.contentTypeFromString(content.type),
      content: content.content,
      writable: content.writable
    });

    this.enabled = enabled;
  }

  /**
   * Update application that is a subject of session.
   *
   * If the session has been already started, then it will be terminated.
   *
   * @param application The application to set, must be instance of HCEApplication.
   */
  async setApplication(application: HCEApplication): Promise<void> {
    if (this.enabled) {
      await NativeHce.setEnabled(false);
      this.enabled = false;
    }

    await NativeHce.setContent(application.content);
    this.application = application;
  }

  /**
   * Get current instance of application present in HCESession.
   */
  getApplication(): (HCEApplication|null) {
    return this.application;
  }

  /**
   * Toggle the state of HCE service.
   *
   * Switch the visibility of HCE background service, If You will enable,
   * then the service will be visible to OS and thus to the card reader.
   *
   * NOTE: You should first set the application object using `setApplication` method to switch on.
   *
   * @param enable True to enable the service, false to disable.
   */
  setEnabled = async (enable: boolean): Promise<void> => {
    if (!this.application && enable) {
      throw new Error("No application set!");
    }

    await NativeHce.setEnabled(enable);
    this.enabled = enable;
  };
}
