/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

export interface LogEntry {
  time: string;
  message: string;
}

export interface NFCTagReactStateProps {
  content: string;
  type: string;
  writable: boolean;
  _pristine: boolean;
}

export interface DataLayer {
  nfcTagProps: NFCTagReactStateProps;
  updateProp: any;
  switchSession: (enable: boolean) => Promise<void>;
  enabled: boolean;
  log: LogEntry[];
  loading: boolean;
}
