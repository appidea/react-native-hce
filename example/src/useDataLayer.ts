/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  HCESessionContext,
  HCESession,
  NFCTagType4NDEFContentType,
  NFCTagType4,
} from 'react-native-hce';
import type {
  DataLayer,
  NFCTagReactStateProps,
  LogEntry,
} from './DataLayerTypes';

const defaultProps: NFCTagReactStateProps = {
  content: '',
  type: NFCTagType4.stringFromContentType(NFCTagType4NDEFContentType.Text),
  writable: false,
  _pristine: true,
};

const createLogEntry = (eventName: string): LogEntry => ({
  time: new Date().toISOString(),
  message: eventName,
});

/**
 * The hook encapsulating the data management layer.
 */
const useDataLayer = (): DataLayer => {
  const { session } = useContext(HCESessionContext);
  const [loading, setLoading] = useState<boolean>(false);

  // ** Following section of code is responsible for: **
  // Management of "Enabled" field state in the application
  const [enabled, setEnabled] = useState<boolean>(false);

  const switchSession = useCallback(
    async (enable) => {
      setLoading(true);
      await session.setEnabled(enable);
      setEnabled(enable);
      setLoading(false);
    },
    [setLoading, session, setEnabled]
  );

  // ** Following section of code is responsible for: **
  // Management of "HCE Application" - related fields state in the application
  const [nfcTagProps, setNfcTagProps] =
    useState<NFCTagReactStateProps>(defaultProps);

  const updateProp = useCallback(
    (prop: string, value: any) => {
      setNfcTagProps((state: any) => ({
        ...state,
        [prop]: value,
        _pristine: false,
      }));
    },
    [setNfcTagProps]
  );

  // ** Following section of code is responsible for: **
  // Synchronize the states: APPLICATION ---> LIBRARY.
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const updateTag = useCallback(
    async (localNfcTagProps) => {
      setLoading(true);

      const tag = new NFCTagType4({
        type: NFCTagType4.contentTypeFromString(localNfcTagProps.type),
        content: localNfcTagProps.content,
        writable: localNfcTagProps.writable,
      });
      await session.setApplication(tag);

      setLoading(false);
    },
    [setLoading, session]
  );

  useEffect(() => {
    if (!nfcTagProps._pristine) {
      const boundUpdateTag = updateTag.bind(null, nfcTagProps);
      timeout.current = setTimeout(boundUpdateTag, 600);
    }

    return () => clearTimeout(timeout.current);
  }, [nfcTagProps, updateTag]);

  // ** Following section of code is responsible for: **
  // Synchronize the states: LIBRARY ---> APPLICATION.
  const updateApp = useCallback(() => {
    const application = session.application;

    if (application === null) {
      return;
    }

    setNfcTagProps({
      type: application.content.type,
      content: application.content.content,
      writable: application.content.writable,
      _pristine: true,
    });

    setEnabled(session.enabled);
  }, [session, setNfcTagProps, setEnabled]);

  useEffect(() => {
    const listener = session.on(
      HCESession.Events.HCE_STATE_WRITE_FULL,
      updateApp
    );
    updateApp();

    return () => {
      listener();
    };
  }, [session, setNfcTagProps, setEnabled, updateApp]);

  // ** Following section of code is responsible for: **
  // Log events to preview in "Events" pane.
  const [log, setLog] = useState<Array<LogEntry>>([]);

  const logger = useCallback(
    (eventData) => {
      setLog((msg) => [...msg, createLogEntry(eventData)]);
    },
    [setLog]
  );

  useEffect(() => {
    const listener = session.addListener('hceState', logger);
    return () => listener.remove();
  }, [session, logger]);

  // ** Following section of code is responsible for: **
  // Return the hook result.
  return { nfcTagProps, updateProp, switchSession, log, enabled, loading };
};

export default useDataLayer;
