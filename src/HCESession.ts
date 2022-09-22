/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import type { HCEApplication } from './HCEApplication';
import { NFCTagType4 } from './NFCTagType4';

const { Hce: NativeHce } = NativeModules;
const eventEmitter = new NativeEventEmitter(NativeHce);

let instance: HCESession | null = null;

const checkPlatform = (): void => {
  if (Platform.OS !== 'android') {
    throw new Error('react-native-hce does not support this platform');
  }
};

/**
 * This interface defines a HCESession constants container object describing a state changes in the emulation.
 * The object itself can be accessed in ``HCESession.Events`` static property.
 *
 * @enum
 */
export interface HCESessionEvents {
  /** When HCE transaction is routed to the application. */
  HCE_STATE_CONNECTED: string;
  /** When HCE transaction is terminated */
  HCE_STATE_DISCONNECTED: string;
  /** When HCE service has been made available to the OS */
  HCE_STATE_ENABLED: string;
  /** When HCE service has been made unavailable to the OS */
  HCE_STATE_DISABLED: string;
  /** When a NFC Tag has been read by the reader */
  HCE_STATE_READ: string;
  /** When a NFC Tag has been written and contains a valid NDEF record */
  HCE_STATE_WRITE_FULL: string;
  /** When a NFC Tag writing is in progress but it's not yet correctly finalized (does not contain valid NDEF record yet). */
  HCE_STATE_WRITE_PARTIAL: string;
  /** When a NFC Tag NDEF record has been changed, due to write or just request of content change in the library. */
  HCE_STATE_UPDATE_APPLICATION: string;
}

/**
 * The HCESession listener. Parameter for {@link HCESession.on} method.
 */
export type HCESessionEventListener = (eventData?: string) => void;

/**
 * The HCESession listener cancellation method. Used as a return valu of {@link HCESession.on} method.
 */
export type HCESessionEventListenerCancel = () => void;

/**
 * @internal
 */
interface HCESessionListenerDescription {
  event: string | null;
  listener: HCESessionEventListener;
}

/**
 * Class for the session state management.
 *
 * HCESession is an entry point for the react-native-hce library.
 * This class manages the entire connection with native counterparts managing the HCE emulation.
 *
 * __You should use only one instance__ of the class should be used per application. That's why we created it with the intention
 * of use as a singleton. __To get the instance, use the {@link getInstance} static method__ that will get a current instance and will do the synchronization with native for You.
 */
export class HCESession {
  /**
   * The current subject application to emulate in HCE.
   *
   * __NOTE__: Do not set the current application by assigning to this property.
   * Use the {@link setApplication} instead.
   */
  application: HCEApplication | null;

  /**
   * Is the HCE Service currently enabled and visible to OS.
   *
   * __NOTE__: Do not set the current state by assigning to this property.
   * Use the {@link setEnabled} instead.
   */
  enabled: boolean;

  /**
   * Container for class' event listeners.
   *
   * @internal
   * @private
   */
  stateListeners: (HCESessionListenerDescription | null)[];

  /**
   * Object that contains the events that the application can listen to using ``HCESession.on(...)``.
   *
   * Check the {@link HCESessionEvents} interface to get the listing of availble events.
   *
   * @example Usage of the property in event listener:
   * ```
   * hceSession.on(HCESession.Events.HCE_CONNECTED)
   * ```
   */
  static Events: HCESessionEvents = NativeHce.getConstants();

  /**
   * Creates the instance of HCE Session class.
   *
   * __NOTE!!!: Do not use this constructor directly. Use {@link getInstance} to get the appropriate and synchronized instance.__
   */
  constructor() {
    this.enabled = false;
    this.application = null;
    this.stateListeners = [];

    this.addListener('hceState', this.handleStateUpdate.bind(this));
  }

  /**
   * Gets the instance of HCE Session.
   *
   * As there is only one HCE Session per application available,
   * use this function to get the instance instead of using the constructor.
   */
  static async getInstance(): Promise<HCESession> {
    checkPlatform();

    if (instance !== null) {
      return instance;
    }

    instance = new HCESession();
    await instance.syncApplication();

    return instance;
  }

  /**
   * Internal method for synchronization with native module.
   *
   * @internal
   * @private
   * @param incomingEvent Native module event parameter
   */
  async handleStateUpdate(incomingEvent: string) {
    if (incomingEvent === HCESession.Events.HCE_STATE_WRITE_FULL) {
      await this.syncApplication();
    }

    this.stateListeners
      .filter((i): i is HCESessionListenerDescription => i !== null)
      .forEach(({ event, listener }) => {
        if (event === null || event === incomingEvent) {
          listener();
        }
      });
  }

  /**
   * Adds event listener to the HCE Session.
   *
   * @param event The event that application should listen to. You should pass the constant from static {@link HCESession.Events} property.
   * If null, the listener will respond to all events - that can be usable for logging purposes.
   * @param listener The event listener.
   * @return Returns the reference to "stop listening" method. To stop listening the event, just call it.
   *
   * @example
   * ```
   * import { ToastAndroid } from "react-native"
   * import { HCESession } from "react-native-hce"
   * ...
   * const instance = await HCESession.getInstance();
   * const removeListener = instance.on(HCESession.Events.HCE_STATE_READ, () => {
   *   ToastAndroid.show("The tag has been read! Thank You.", ToastAndroid.LONG);
   *   removeListener();
   * };
   * ```
   */
  on(
    event: string | null,
    listener: HCESessionEventListener
  ): HCESessionEventListenerCancel {
    const index = this.stateListeners.push({ event, listener });
    return () => {
      this.stateListeners[index] = null;
    };
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
  };

  /**
   * Synchronize the class with current native state.
   *
   * __NOTE__: You should not use this function normally.
   * Internal implementation will call it for You, if needed.
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
      writable: content.writable,
    });

    this.enabled = enabled;
  }

  /**
   * Update the subject application to emulate in HCE.
   *
   * @param application The application to set, must be instance of HCEApplication.
   */
  async setApplication(application: HCEApplication): Promise<void> {
    await NativeHce.setContent(application.content);
    this.application = application;
  }

  /**
   * Toggle the state of HCE service.
   *
   * This function allows to enable or disable the native component of HCE Service.
   * If enabled, the native HostApduService will be recognizable by platform's HCE router.
   * If not, service won't be recognized, thus all the interactions between HCE and reader won't be available.
   *
   * __NOTE:__ Before switching the service on, use the {@link setApplication}
   * first to register the content that You want to emulate using HCE.
   *
   * @param enable True to enable the service, false to disable.
   */
  setEnabled = async (enable: boolean): Promise<void> => {
    if (!this.application && enable) {
      throw new Error('No application set!');
    }

    await NativeHce.setEnabled(enable);
    this.enabled = enable;
  };
}
