/*
 * Copyright (c) 2020-2022 Mateusz Falkowski (appidea.pl) and contributors. All rights reserved.
 * This file is part of "react-native-hce" library: https://github.com/appidea/react-native-hce
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import HCESession, { NFCContentType } from 'react-native-hce';

interface LogEntry {
  time: string,
  message: string
}

interface NFCTagReactStateProps {
  content: string,
  type: string,
  writable: boolean
}

export interface ControlProps {
  nfcTagProps: NFCTagReactStateProps,
  updateProp: any,
  session: (HCESession|null),
  startSession: () => void,
  terminateSession: () => void,
  logMsg: LogEntry[]
}
