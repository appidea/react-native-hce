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
